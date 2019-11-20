import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import Store from '../store';
import deepGet from 'lodash/get';
import clone from 'lodash/clone';


import {
  upsertRecordedVideo,
  clearRecordedVideo,
  upsertImageEntities,
  upsertVideoEntities,
  videoInProcessing
} from '../actions';
import utilities from './Utilities';
import appConfig from '../constants/AppConfig';
import FfmpegProcesser from './FfmpegProcesser';
import UploadToS3 from './UploadToS3';
import PepoApi from './PepoApi';
import ReduxGetters from './ReduxGetters';
import videoUploaderComponent from './CameraWorkerEventEmitter';
import createObjectForRedux from '../helpers/createObjectForRedux';
import Toast from '../theme/components/NotificationToast';
import CurrentUser from '../models/CurrentUser';
import DataContract from "../constants/DataContract";
import {TransactionExecutor} from './TransactionExecutor';
import { ostSdkErrors } from '../services/OstSdkErrors';
import AppConfig from '../constants/AppConfig';
const recordedVideoStates = [
  'raw_video',
  'compressed_video',
  's3_video',
  'cover_image',
  's3_cover_image',
  'video_desc',
  'video_link',
  'reply_amount',
  'video_type',
  'reply_obj'
];

const processingStatuses = [
  'compression_processing',
  'video_s3_upload_processing',
  'cover_capture_processing',
  'cover_s3_upload_processing'
];

const recordedVideoActions = ['do_upload', 'do_discard'];

const INVALID = 'INVALID';

class CameraWorker extends PureComponent {
  constructor() {
    super();
    this.syncedFromAsyncToRedux = false;
  }

  syncAsyncToRedux() {
    // Early exit
    if (this.syncedFromAsyncToRedux) {
      return;
    }

    if (!this.props.currentUserId) {
      console.log('syncAsyncToRedux :: Cannot sync as current_user is not yet available');
      return;
    }
    if (Object.keys(this.props.recorded_video).length > 0) {
      console.log('syncAsyncToRedux :: No sync needed as recorded_video has data');
      return;
    }

    // Need to sync
    if (this.getCurrentUserRecordedVideoKey()) {
      utilities.getItem(this.getCurrentUserRecordedVideoKey()).then((data) => {
        Store.dispatch(upsertRecordedVideo(JSON.parse(data)));
        this.syncedFromAsyncToRedux = true;
        console.log('syncAsyncToRedux :: Data synced from Async to recorded_video', data);
      });
    } else {
      console.log('syncAsyncToRedux :: No data found to sync');
    }
  }

  syncReduxToAsync() {
    // Need to sync
    if (this.getCurrentUserRecordedVideoKey()) {
      let data = this.getDataforAsync();
      if (Object.keys(data).length > 0) {
        utilities.saveItem(this.getCurrentUserRecordedVideoKey(), data).then(() => {
          console.log('syncReduxToAsync :: Data synced from recorded_video to Async');
        });
      }
    }
  }

  VideoUploadStatusToProcessing = () => {
    if (this.props.recorded_video.do_upload){
      Store.dispatch(videoInProcessing(true));
      videoUploaderComponent.emit('show');
    };
  };

  VideoUploadStatusToNotProcessing = () => {
    Store.dispatch(videoInProcessing(false));
    videoUploaderComponent.emit('hide');
  };

  async processVideo() {
    // Early exit
    if ( ! this.props.currentUserId || Object.keys(this.props.recorded_video).length === 0) {
      console.log('processVideo :: Nothing to process');
      return;
    }

    // Clean-up check
    if (this.props.recorded_video.do_discard) {
      console.log(
        'processVideo :: Discarding video... Cleaning up Async, Stop Compression,  remove files from cache, cleanup Redux'
      );
      this.cleanUp();
      return;
    }

    // No upload consent, so only compress and take cover image
    if (!this.props.recorded_video.do_upload) {
      console.log('processVideo :: No upload consent. Compressing to save time...');
      await this.createThumbnail();
      console.log('processVideo :: No upload consent. Taking cover image...');
      await this.compressVideo();
      return;
    }

    if (this.props.recorded_video.do_upload) {
      if (!ReduxGetters.getVideoProcessingStatus()) {
        this.VideoUploadStatusToProcessing();
      }

      console.log(
        'processVideo :: Got upload consent. Uploading video and cover image to s3 and attempting post Video with Cover Image...'
      );
      await this.processVideoBasedOnType ();

    }
  }


  processVideoBasedOnType = async () => {
    let videoType = this.props.recorded_video.video_type;
    if (! videoType){
      return;
    }
    if (videoType === 'post'){
        await this.processPostVideo();
    } else if (videoType === 'reply'){
       await this.processReplyVideo();
    }
  };


  processPostVideo = async () => {
    await this.uploadVideo();
    await this.uploadCoverImage();
    await this.postVideoToPepoApi();
  };


  processReplyVideo = async () => {
    // let sessionCreated = await this.ensureSession();
    //
    // if (! sessionCreated) {
    //   return ;
    // }
    await this.uploadReplyVideo();
    await this.executeTransaction()


  };

  videoUploadedSuccessCallback = ( ostWorkflowContext, ostWorkflowEntity ) => {
    console.log('CameraWorker.videoUploadedSuccessCallback');
    Toast.show({
      text: 'Your video uploaded successfully.',
      icon: 'success',
      imageUri: this.props.recorded_video.cover_image
    });
    this.executingTx = false;
    Store.dispatch(
      upsertRecordedVideo({
        do_discard: true,
        pepo_api_posting: false
      })
    );
  };

  onFlowInterrupt = (ostWorkflowContext, error) => {
    console.log('CameraWorker.onFlowInterrupt', ostWorkflowContext, error);
    this.VideoUploadStatusToNotProcessing();
    this.executingTx = false;
    Toast.show({
      text: ostSdkErrors.getErrorMessage(ostWorkflowContext, error),
      icon: 'error'
    });
  };


  getSdkMetaProperties = () => {
    const metaProperties = clone(AppConfig.replyMetaProperties);
    let parentVideoId =  deepGet(this.props.recorded_video , 'reply_obj.replyReceiverVideoId'),
    replyDetailId = deepGet(this.props.recorded_video , 'reply_obj.replyDetailId')
    ;

    if (! parentVideoId || ! replyDetailId ){
      return ;
    }

    let details = `vi_${parentVideoId} `;
    details += `rdi_${replyDetailId}`;
    metaProperties['details'] = details;
    return metaProperties;
  };


  executeTransaction = () => {

    let goForTx = this.props.recorded_video.go_for_tx,
      doDiscard = this.props.recorded_video.do_discard,
    receiverUserId = deepGet (this.props.recorded_video, 'reply_obj.replyReceiverUserId'),
    amountToSendWithReply = deepGet(this.props.recorded_video, 'reply_obj.amountToSendWithReply');
    if (! goForTx || ! receiverUserId || doDiscard || this.executingTx ){
      return;
    }
    this.executingTx = true;
    if ( receiverUserId === this.props.currentUserId || ! Number(amountToSendWithReply)) {
      this.videoUploadedSuccessCallback();
      return;
    };
    this.VideoUploadStatusToProcessing();
    console.log('CameraWorker.executeTransaction');


    let callbacks = {onRequestAcknowledge: this.videoUploadedSuccessCallback, onFlowInterrupt: this.onFlowInterrupt};
    let config = {metaProperties: this.getSdkMetaProperties()};

    let txExecutor = new TransactionExecutor(config, callbacks);
    txExecutor.sendTransactionToSdk( amountToSendWithReply, receiverUserId, false);
    // todo : Execute transaction code. call clean up after that.

  };


  uploadReplyVideo = async () => {
    console.log('CameraWorker.uploadReplyVideo');
    await this.uploadVideo();
    await this.uploadCoverImage();
    await this.postReplyVideoToPepoApi()  ;
  };


  postReplyVideoToPepoApi = async () => {

    let readyForTx = deepGet(this.props.recorded_video , 'go_for_tx' ),
      parentVideoId =  deepGet(this.props.recorded_video , 'reply_obj.replyReceiverVideoId');

    if ( readyForTx || !parentVideoId ) {
      // we have reply OR we dont have video Id
      return true
    }

    if (
      this.props.recorded_video.s3_video &&
      !this.props.recorded_video.pepo_api_posting &&
      !this.postToPepoApi
    ) {
      this.postToPepoApi = true;
      let videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
      let videoSize = videoInfo.size;
      let imageInfo, imageSize;
      if(this.props.recorded_video.cover_image !== INVALID){
        imageInfo = await RNFS.stat(this.props.recorded_video.cover_image);
        imageSize = imageInfo.size;
      }
      console.log('CameraWorker.postReplyVideoToPepoApi');
      Store.dispatch(
        upsertRecordedVideo({
          pepo_api_posting: true
        })
      );

      let payloadWithoutImage = {
        video_url: this.props.recorded_video.s3_video,
        video_description: this.props.recorded_video.video_desc,
        link: this.props.recorded_video.video_link,
        video_width: appConfig.cameraConstants.VIDEO_WIDTH,
        video_height: appConfig.cameraConstants.VIDEO_HEIGHT,
        image_width: appConfig.cameraConstants.VIDEO_WIDTH,
        image_height: appConfig.cameraConstants.VIDEO_HEIGHT,
        video_size: videoSize,
        parent_kind: 'video',
        parent_id: parentVideoId
      };

      let payload = payloadWithoutImage;

      if(this.props.recorded_video.cover_image !== INVALID){
        payload = {
          ...payload,
          poster_image_url: this.props.recorded_video.s3_cover_image,
          image_size: imageSize
        };
      }

      let replyDetailId = deepGet(this.props.recorded_video , 'reply_obj.replyDetailId' );
      if (replyDetailId) {
        payload['reply_detail_id'] = replyDetailId;
      }

      new PepoApi(`/replies`)
        .post(payload)
        .then((responseData) => {
          Store.dispatch(
            upsertRecordedVideo({
              pepo_api_posting: false
            })
          );

          if (responseData.success && responseData.data) {
            console.log('reply sent Successfully to Pepo Api');
            let resultType = deepGet(responseData, DataContract.common.resultType),
              reply = deepGet(responseData, `data.${resultType}` );

            if (reply && reply.length > 0 ){
              let replyObj = deepGet(this.props.recorded_video , 'reply_obj' );
                  replyObj['replyDetailId'] = reply[0].payload.reply_detail_id;
                Store.dispatch(
                upsertRecordedVideo({
                  reply_obj: replyObj,
                  go_for_tx: true
                })
              );
            }
          } else {
            Toast.show({
              text: responseData.err.msg,
              icon: 'error'
            });
            this.VideoUploadStatusToNotProcessing();
          }
          this.postToPepoApi = false;
        })
        .catch(() => {
          this.postToPepoApi = false;
          Store.dispatch(
            upsertRecordedVideo({
              pepo_api_posting: false
            })
          );
          Toast.show({
            text: 'Video upload failed - Try Again',
            icon: 'error'
          });
        });
    }
  };

  async cleanUp() {
    // stop ffmpge processing
    this.VideoUploadStatusToNotProcessing();
    FfmpegProcesser.cancel();
    // remove files from cache,
    await this.removeFile(this.props.recorded_video.raw_video);
    await this.removeFile(this.props.recorded_video.compressed_video);
    await this.removeFile(this.props.recorded_video.cover_image);
    // Cleaning up Async
    utilities.removeItem(this.getCurrentUserRecordedVideoKey());
    // cleanup Redux
    Store.dispatch(clearRecordedVideo());
  }

  async removeFile(file) {
    if (!file) {
      return;
    }
    let isFileExists = await RNFS.exists(file);
    if (isFileExists) {
      await RNFS.unlink(file);
      return true;
    }
    return false;
  }

  async createThumbnail() {
    return new Promise((resolve, reject) => {
      if (
        this.props.recorded_video.raw_video &&
        !this.props.recorded_video.cover_capture_processing &&
        !this.props.recorded_video.cover_image
      ) {
        Store.dispatch(
          upsertRecordedVideo({
            cover_capture_processing: true
          })
        );
        FfmpegProcesser.init(this.props.recorded_video.raw_video);
        FfmpegProcesser.getVideoThumbnail()
          .then((coverImage) => {
            Store.dispatch(
              upsertRecordedVideo({
                cover_image: coverImage,
                cover_capture_processing: false
              })
            );
            resolve();
          })
          .catch(() => {
            Store.dispatch(
              upsertRecordedVideo({
                cover_image: INVALID,
                cover_capture_processing: false
              })
            );
            resolve();
          });
      } else {
        resolve();
      }
    });
  }

  async compressVideo() {
    return new Promise((resolve, reject) => {
      if (
        this.props.recorded_video.raw_video &&
        !this.props.recorded_video.compression_processing &&
        this.props.recorded_video.cover_image &&
        !this.props.recorded_video.compressed_video
      ) {
        Store.dispatch(
          upsertRecordedVideo({
            compression_processing: true
          })
        );
        this.VideoUploadStatusToProcessing();
        FfmpegProcesser.init(this.props.recorded_video.raw_video);

        FfmpegProcesser.compress()
          .then((compressedVideo) => {
            console.log('compressVideo: then', compressedVideo);
            Store.dispatch(
              upsertRecordedVideo({
                compressed_video: compressedVideo,
                compression_processing: false
              })
            );
            resolve();
          })
          .catch((err) => {
            resolve();
            Store.dispatch(
              upsertRecordedVideo({
                compression_processing: false
              })
            );
            console.log('compressVideo: catch', err);
          });
      } else {
        resolve();
      }
    });
  }

  updateProfileViewVideo(coverImage, video) {
    let imageObject = createObjectForRedux.createImageObject({
      url: coverImage,
      height: appConfig.cameraConstants.VIDEO_HEIGHT,
      width: appConfig.cameraConstants.VIDEO_WIDTH,
      size: '10000'
    });

    let videoObject = createObjectForRedux.createVideoObject(
      {
        url: video,
        height: appConfig.cameraConstants.VIDEO_HEIGHT,
        width: appConfig.cameraConstants.VIDEO_WIDTH,
        size: '10000'
      },
      imageObject.key
    );

    Store.dispatch(upsertImageEntities(imageObject.value));
    Store.dispatch(upsertVideoEntities(videoObject.value));
  }

  async uploadVideo() {
    !this.props.recorded_video.compressed_video && (await this.compressVideo());

    if (
      this.props.recorded_video.compressed_video &&
      !this.props.recorded_video.video_s3_upload_processing &&
      !this.props.recorded_video.s3_video
    ) {
      Store.dispatch(
        upsertRecordedVideo({
          video_s3_upload_processing: true
        })
      );
      this.VideoUploadStatusToProcessing();
      return this.uploadToS3(this.props.recorded_video.compressed_video, 'video')
        .then((s3Video) => {
          console.log('uploadVideo success :: s3Video', s3Video);
          Store.dispatch(
            upsertRecordedVideo({
              s3_video: s3Video,
              video_s3_upload_processing: false
            })
          );
        })
        .catch((err) => {
          console.log('uploadVideo error :: s3Video', err);
          Store.dispatch(
            upsertRecordedVideo({
              video_s3_upload_processing: false
            })
          );
        });
    }
  }

  async uploadCoverImage() {
    !this.props.recorded_video.cover_image && (await this.createThumbnail());
    if (
      this.props.recorded_video.cover_image &&
      this.props.recorded_video.cover_image !== INVALID &&
      !this.props.recorded_video.cover_s3_upload_processing &&
      !this.props.recorded_video.s3_cover_image
    ) {
      Store.dispatch(
        upsertRecordedVideo({
          cover_s3_upload_processing: true
        })
      );

     return this.uploadToS3(this.props.recorded_video.cover_image, 'image')
        .then((s3CoverImage) => {
          console.log('uploadCoverImage success :: s3CoverImage', s3CoverImage);
          Store.dispatch(
            upsertRecordedVideo({
              s3_cover_image: s3CoverImage,
              cover_s3_upload_processing: false
            })
          );
        })
        .catch((err) => {
          console.log('uploadCoverImage error :: s3CoverImage', err);
          Store.dispatch(
            upsertRecordedVideo({
              cover_s3_upload_processing: false
            })
          );
        });
    }
  }

  async uploadToS3(fileToUpload, fileType) {
    let uploadToS3 = new UploadToS3(fileToUpload, fileType);
    return uploadToS3.perform();
  }

  async postVideoToPepoApi() {
    if (
      this.props.recorded_video.s3_video &&
      !this.props.recorded_video.pepo_api_posting &&
      !this.postToPepoApi
    ) {
      this.postToPepoApi = true;
      let videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
      let videoSize = videoInfo.size;
      let imageInfo, imageSize;
      if(this.props.recorded_video.cover_image !== INVALID){
        imageInfo = await RNFS.stat(this.props.recorded_video.cover_image);
        imageSize = imageInfo.size;
      }

      Store.dispatch(
        upsertRecordedVideo({
          pepo_api_posting: true
        })
      );

      let payloadWithoutImage = {
        video_url: this.props.recorded_video.s3_video,
        video_description: this.props.recorded_video.video_desc,
        link: this.props.recorded_video.video_link,
        video_width: appConfig.cameraConstants.VIDEO_WIDTH,
        video_height: appConfig.cameraConstants.VIDEO_HEIGHT,
        image_width: appConfig.cameraConstants.VIDEO_WIDTH,
        image_height: appConfig.cameraConstants.VIDEO_HEIGHT,
        video_size: videoSize,
        per_reply_amount_in_wei: this.props.recorded_video.reply_amount
      };

      let payload = payloadWithoutImage;

      if(this.props.recorded_video.cover_image !== INVALID){
        payload = {
          ...payload,
          poster_image_url: this.props.recorded_video.s3_cover_image,
          image_size: imageSize
        };
      }

      return new PepoApi(`/users/${this.props.currentUserId}/fan-video`)
        .post(payload)
        .then((responseData) => {
          if (responseData.success && responseData.data) {
            console.log('Video uploaded Successfully');
            Toast.show({
              text: 'Your video uploaded successfully.',
              icon: 'success',
              imageUri: this.props.recorded_video.cover_image
            });
            Store.dispatch(
              upsertRecordedVideo({
                do_discard: true,
                pepo_api_posting: false
              })
            );
          } else {
            this.VideoUploadStatusToNotProcessing();
          }
          this.postToPepoApi = false;
        })
        .catch(() => {
          this.postToPepoApi = false;
          Store.dispatch(
            upsertRecordedVideo({
              pepo_api_posting: false
            })
          );
          Toast.show({
            text: 'Video upload failed - Try Again',
            icon: 'error'
          });
        });
    }
  }

  getCurrentUserRecordedVideoKey() {
    if (this.props.currentUserId) {
      return `user-${this.props.currentUserId}-recorded_video`;
    }
    return;
  }

  getDataforAsync() {
    let dataforAsync = {};
    recordedVideoStates.forEach((value, index) => {
      let currentValue = this.props.recorded_video[value];
      if (currentValue) dataforAsync[value] = currentValue;
    });

    return dataforAsync;
  }

  render() {
    this.syncAsyncToRedux();
    this.syncReduxToAsync();
    this.processVideo();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({ recorded_video }) => ({ recorded_video, currentUserId: CurrentUser.getUserId(), currentOstUserId: CurrentUser.getOstUserId() });

export default connect(mapStateToProps)(CameraWorker);
