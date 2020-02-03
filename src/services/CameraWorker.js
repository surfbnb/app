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
import { fetchVideo } from '../helpers/helpers';
import {getPixelDataOnFanVideoSuccess, getPixelDataOnReplyVideoSuccess} from "../helpers/cameraHelper";

const recordedVideoStates = [
  'raw_video_list',
  'compressed_video',
  's3_video',
  'video_length',
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
    this.videoMergeJobId = null;
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
    if (this.isCleanUpCalled || this.props.recorded_video.do_discard || ! this.props.recorded_video.do_upload) {
      console.log('VideoUploadStatusToProcessing:: return condition');
      return;
    }
    Store.dispatch(videoInProcessing(true));
    videoUploaderComponent.emit('show');
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
        console.log('processVideo :: VideoUploadStatusToProcessing');
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
    } else if (videoType === DataContract.knownEntityTypes.reply){
       await this.processReplyVideo();
    }
  };


  processPostVideo = async () => {
    await this.uploadVideo();
    await this.uploadCoverImage();
    await this.postVideoToPepoApi();
  };


  processReplyVideo = async () => {
    console.log(
      '-----processReplyVideo--------'
    );

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
    let recordedVideo = {...this.props.recorded_video};
    getPixelDataOnReplyVideoSuccess(recordedVideo);
    Toast.show({
      text: 'Your video uploaded successfully.',
      icon: 'success',
      imageUri: recordedVideo.cover_image
    });
    this.executeTx = false;
    Store.dispatch(
      upsertRecordedVideo({
        do_discard: true,
        pepo_api_posting: false,
      })
    );
    this.fetchParentVideo();



  };

  fetchParentVideo = () => {
    const videoId = deepGet(this.props.recorded_video , 'reply_obj.replyReceiverVideoId');
    fetchVideo( videoId  );
  };

  onFlowInterrupt = (ostWorkflowContext, error) => {
    console.log('CameraWorker.onFlowInterrupt', ostWorkflowContext, error);
    console.log('onFlowInterrupt::VideoUploadStatusToNotProcessing');
    this.executionFailed();
    Toast.show({
      text: ostSdkErrors.getErrorMessage(ostWorkflowContext, error),
      icon: 'error'
    });
  };


  executionFailed = () => {
    Store.dispatch(
      upsertRecordedVideo({
        do_upload: false,
        go_for_tx: false
      })
    );
    this.executeTx = false;
    this.VideoUploadStatusToNotProcessing();
    this.executingTx = false;
  }


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

  isReplyChargeable = () => {
    let isChargeable = deepGet (this.props.recorded_video, 'reply_obj.isChargeble'),
        amountToSendWithReply = deepGet(this.props.recorded_video, 'reply_obj.amountToSendWithReply');
      return isChargeable && amountToSendWithReply != '0';
  };

  onPlatfromAcknowledgeComplete = (videoId) => {    
    new PepoApi(`/videos/${videoId}`)
      .get()
      .then((res) => {})
      .catch((error) => {});
  };




  executeTransaction = () => {

    if (this.checkIfDiscardedAndClean()){
      return;
    }

    let goForTx = this.props.recorded_video.go_for_tx,
      doDiscard = this.props.recorded_video.do_discard,
    receiverUserId = deepGet (this.props.recorded_video, 'reply_obj.replyReceiverUserId'),
    amountToSendWithReply = deepGet(this.props.recorded_video, 'reply_obj.amountToSendWithReply'),
      toTokenHolderAddress = deepGet(this.props.recorded_video,'reply_obj.toTokenHolderAddress' ),
      parentVideoId =  deepGet(this.props.recorded_video , 'reply_obj.replyReceiverVideoId');
    if (! goForTx || ! receiverUserId || doDiscard || this.executeTx ){
      return;
    }
    this.executeTx = true;
    console.log('executeTransaction::VideoUploadStatusToProcessing');
    this.VideoUploadStatusToProcessing();
    console.log('CameraWorker.executeTransaction');

    if (! this.isReplyChargeable()) {
      this.videoUploadedSuccessCallback();
      return;
    }

    upsertRecordedVideo({
      executing_tx: true
    });


    let callbacks = {
      onRequestAcknowledge: this.videoUploadedSuccessCallback, 
        onFlowInterrupt: this.onFlowInterrupt, 
        onPlatfromAcknowledgeComplete: () => {this.onPlatfromAcknowledgeComplete(parentVideoId)}
        };
    let config = {metaProperties: this.getSdkMetaProperties()};
    let txExecutor = new TransactionExecutor(config, callbacks);
    txExecutor.sendTransactionToSdk( amountToSendWithReply, toTokenHolderAddress, false);
    // todo : Execute transaction code. call clean up after that.

  };

  checkIfDiscardedAndClean = () => {
    if (this.props.recorded_video.do_discard) {
      console.log(
        'processVideo :: Discarding video... Cleaning up Async, Stop Compression,  remove files from cache, cleanup Redux'
      );
      this.cleanUp();
      return true;
    }
  };


  uploadReplyVideo = async () => {
    console.log('CameraWorker.uploadReplyVideo');
    await this.uploadVideo();
    await this.uploadCoverImage();
    await this.postReplyVideoToPepoApi()  ;
  };


  postReplyVideoToPepoApi = async () => {

    if (this.checkIfDiscardedAndClean()){
      return;
    }

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

      let imageInfo, imageSize, videoInfo, videoSize;
      if(this.props.recorded_video.cover_image !== INVALID){
        imageInfo = await RNFS.stat(this.props.recorded_video.cover_image);
        imageSize = imageInfo.size;
      }

      if (this.props.recorded_video.compressed_video !== INVALID ){
        videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
        videoSize = videoInfo.size;

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
        parent_kind: DataContract.knownEntityTypes.video,
        parent_id: parentVideoId
      };

      let payload = payloadWithoutImage;

      if (this.props.recorded_video.cover_image !== INVALID) {
        payload = {
          ...payload,
          poster_image_url: this.props.recorded_video.s3_cover_image,
          image_size: imageSize
        };
      }

      if (this.props.recorded_video.compressed_video !== INVALID ){
        payload = {
          ...payload,
          video_size: videoSize
        };
      }

      let replyDetailId = deepGet(this.props.recorded_video , 'reply_obj.replyDetailId' );
      if (replyDetailId) {
        payload['reply_detail_id'] = replyDetailId;
      }

      new PepoApi(DataContract.videos.replyVideoUploadApi)
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
            console.log('/replies:::VideoUploadStatusToNotProcessing');
            this.VideoUploadStatusToNotProcessing();
            Store.dispatch(
              upsertRecordedVideo({
                do_upload: false
              })
            );
            this.executeTx = false;
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
    if (this.isCleanUpCalled){
      return;
    }
    this.isCleanUpCalled = true;
    console.log('cleanUp:::VideoUploadStatusToNotProcessing');
    this.VideoUploadStatusToNotProcessing();
    FfmpegProcesser.cancel();
    // remove files from cache,
    this.videoMergeJobId = null;
    let recordedVideoList = this.props.recorded_video.raw_video_list;
    let filesList = (recordedVideoList && recordedVideoList.map((ele)=> ele.uri)) || [];
    for (let video of filesList){
      await this.removeFile(video);
    }
    await this.removeFile(this.props.recorded_video.compressed_video);
    await this.removeFile(this.props.recorded_video.cover_image);
    // Cleaning up Async
    utilities.removeItem(this.getCurrentUserRecordedVideoKey());
    // cleanup Redux
    Store.dispatch(clearRecordedVideo());
    this.isCleanUpCalled = false;
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
        this.props.recorded_video.raw_video_list &&
        this.props.recorded_video.raw_video_list.length > 0 &&
        !this.props.recorded_video.cover_capture_processing &&
        !this.props.recorded_video.cover_image
      ) {
        Store.dispatch(
          upsertRecordedVideo({
            cover_capture_processing: true
          })
        );
        let videoList = this.props.recorded_video.raw_video_list.map((ele=>(ele.uri)));
        FfmpegProcesser.init(videoList);
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
        this.props.recorded_video.raw_video_list &&
        this.props.recorded_video.raw_video_list.length > 0 &&
        !this.props.recorded_video.compression_processing &&
        this.props.recorded_video.cover_image &&
        !this.props.recorded_video.compressed_video
      ) {
        Store.dispatch(
          upsertRecordedVideo({
            compression_processing: true
          })
        );
        console.log('compressVideo:::VideoUploadStatusToProcessing');
        this.VideoUploadStatusToProcessing();
        let videoList = this.props.recorded_video.raw_video_list.map(ele=>ele.uri);
        FfmpegProcesser.init(videoList);
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
            console.log('Ffmpeg failed #invalidCompressedVideo');
            Store.dispatch(
              upsertRecordedVideo({
                compressed_video: INVALID,
                compression_processing: false
              })
            );
            resolve();
            console.log('compressVideo: catch', err);
          });
      } else {
        resolve();
      }
    });
  }

  stitchingSuccessedVideoUpload = () => {
    return this.uploadToS3([this.props.recorded_video.compressed_video], 'video')
      .then((s3Video) => {
        console.log('uploadVideo success :: s3Video', s3Video);
        Store.dispatch(
          upsertRecordedVideo({
            s3_video: s3Video.length && s3Video[0],
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

  };

  pollingFailed = () => {
    clearInterval(this.pollingForStitchingCompletion);
    this.VideoUploadStatusToNotProcessing();
    Toast.show({
      text: 'Video upload failed',
      icon: 'error'
    });
  };

  pollForCompleteStitching = () => {
    if (this.currentPollingCount >= 15 ) {
      this.pollingFailed();
    }
    this.currentPollingCount += 1;

    return new PepoApi( DataContract.videos.videoMergePollApi(this.videoMergeJobId))
      .get()
      .then((responseData) => {
        if (responseData.success && responseData.data) {
          let resultType = deepGet(responseData, DataContract.common.resultType),
            videoMergeJobDetails = deepGet(responseData, `data.${resultType}`);
          if(videoMergeJobDetails.status === AppConfig.stitchingStatus.done){
            console.log(videoMergeJobDetails.merged_url, 'videoMergeJobDetails.merged_url');
            Store.dispatch(
              upsertRecordedVideo({
                s3_video: videoMergeJobDetails.merged_url,
                video_s3_upload_processing: false
              })
            );
            clearInterval(this.pollingForStitchingCompletion);
          } else if ( videoMergeJobDetails.status ===  AppConfig.stitchingStatus.failed ) {
            this.pollingFailed();
          }
        } else {
          this.pollingFailed();
        }
      }).catch(() => {
        this.pollingFailed();
      })
  };

  stitchingFailedVideoUpload = () => {
    console.log(this.props.recorded_video.raw_video_list, 'this.props.recorded_video.raw_video_list');
    let videoList = this.props.recorded_video.raw_video_list.map(ele=>ele.uri);
    return this.uploadToS3(videoList, 'video')
      .then((s3VideoList) => {
        console.log(s3VideoList, 's3VideoList');
        let resolution = `${appConfig.cameraConstants.VIDEO_WIDTH}*${appConfig.cameraConstants.VIDEO_HEIGHT}`,
        list = s3VideoList.map((s3Video)=>{
          return {video_url:s3Video, resolution}
        });
        let payload = { video_urls : JSON.stringify(list)};
        return new PepoApi(DataContract.videos.videoMergeApi)
          .post(payload)
          .then((responseData) => {
            if (responseData.success && responseData.data) {
              let resultType = deepGet(responseData, DataContract.common.resultType),
                videoMergeJob = deepGet(responseData, `data.${resultType}`);
                this.videoMergeJobId = videoMergeJob.id;
                this.currentPollingCount = 0;
                this.pollingForStitchingCompletion = setInterval(this.pollForCompleteStitching, 10000);
            } else {
              this.VideoUploadStatusToNotProcessing();
            }
          })
      })
      .catch((err) => {
        console.log('uploadVideo error :: s3Video', err);
        this.VideoUploadStatusToNotProcessing();
      });
  };



  async uploadVideo() {
    if (this.checkIfDiscardedAndClean()){
      return;
    }

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
      if (this.props.recorded_video.compressed_video === INVALID){
        return this.stitchingFailedVideoUpload();
      } else {
        return this.stitchingSuccessedVideoUpload();
      }


    }
  }

  async uploadCoverImage() {

    if (this.checkIfDiscardedAndClean()){
      return;
    }

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

     return this.uploadToS3([this.props.recorded_video.cover_image], 'image')
        .then((s3CoverImage) => {
          console.log('uploadCoverImage success :: s3CoverImage', s3CoverImage);
          Store.dispatch(
            upsertRecordedVideo({
              s3_cover_image: s3CoverImage[0],
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

    if (this.checkIfDiscardedAndClean()){
      return;
    }

    if (
      this.props.recorded_video.s3_video &&
      !this.props.recorded_video.pepo_api_posting &&
      !this.postToPepoApi
    ) {
      this.postToPepoApi = true;

      let imageInfo, imageSize, videoInfo, videoSize ;

      if (this.props.recorded_video.compressed_video !== INVALID) {
        videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
        videoSize = videoInfo.size;
      }

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

      if (this.props.recorded_video.compressed_video !== INVALID ){
        payload = {
          ...payload,
          video_size: videoSize
        };

      }

      return new PepoApi(DataContract.videos.fanVideoUploadApi(this.props.currentUserId))
        .post(payload)
        .then((responseData) => {
          if (responseData.success && responseData.data) {
            console.log('Video uploaded Successfully');
            Toast.show({
              text: 'Your video uploaded successfully.',
              icon: 'success',
              imageUri: this.props.recorded_video.cover_image
            });
            let recordedVideo = {...this.props.recorded_video};
            let resultType = deepGet(responseData, DataContract.common.resultType);
            Store.dispatch(
              upsertRecordedVideo({
                do_discard: true,
                pepo_api_posting: false
              })
            );
            let videoId = deepGet(responseData, `data.${resultType}[0].payload.video_id` );
            getPixelDataOnFanVideoSuccess(recordedVideo, videoId);
          } else {
            console.log('/fanvideo:::VideoUploadStatusToNotProcessing');
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
