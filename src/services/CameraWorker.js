import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import RNFS from 'react-native-fs';
import Store from '../store';

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

const recordedVideoStates = [
  'raw_video',
  'compressed_video',
  's3_video',
  'cover_image',
  's3_cover_image',
  'video_desc',
  'video_link'
];

const processingStatuses = [
  'compression_processing',
  'video_s3_upload_processing',
  'cover_capture_processing',
  'cover_s3_upload_processing'
];

const recordedVideoActions = ['do_upload', 'do_discard'];

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

    if (Object.keys(this.props.current_user).length === 0) {
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

  async processVideo() {
    // Early exit
    if (Object.keys(this.props.current_user).length === 0 || Object.keys(this.props.recorded_video).length === 0) {
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
      !ReduxGetters.getVideoProcessingStatus() && Store.dispatch(videoInProcessing(true));

      console.log(
        'processVideo :: Got upload consent. Uploading video and cover image to s3 and attempting post Video with Cover Image...'
      );
      this.updateProfileViewRawVideo();
      await this.uploadVideo();
      await this.uploadCoverImage();
      this.postVideoWithCoverImage();
    }
  }

  updateProfileViewRawVideo() {
    if (this.props.recorded_video.cover_image && !this.props.recorded_video.video_s3_upload_processing) {
      // this.updateProfileViewVideo(this.props.recorded_video.cover_image, this.props.recorded_video.raw_video);
    }
  }

  async cleanUp() {
    // stop ffmpge processing
    videoUploaderComponent.emit('hide');
    Store.dispatch(videoInProcessing(false));
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
        videoUploaderComponent.emit('show');
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
      videoUploaderComponent.emit('show');
      this.uploadToS3(this.props.recorded_video.compressed_video, 'video')
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
      !this.props.recorded_video.cover_s3_upload_processing &&
      !this.props.recorded_video.s3_cover_image
    ) {
      Store.dispatch(
        upsertRecordedVideo({
          cover_s3_upload_processing: true
        })
      );

      this.uploadToS3(this.props.recorded_video.cover_image, 'image')
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

  async postVideoWithCoverImage() {
    if (
      this.props.recorded_video.s3_video &&
      this.props.recorded_video.s3_cover_image &&
      !this.props.recorded_video.pepo_api_posting &&
      !this.postToPepoApi
    ) {
      this.postToPepoApi = true;
      let videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
      let videoSize = videoInfo.size;
      let imageInfo = await RNFS.stat(this.props.recorded_video.cover_image);
      let imageSize = imageInfo.size;

      Store.dispatch(
        upsertRecordedVideo({
          pepo_api_posting: true
        })
      );

      let payload = {
        video_url: this.props.recorded_video.s3_video,
        poster_image_url: this.props.recorded_video.s3_cover_image,
        video_description: this.props.recorded_video.video_desc,
        link: this.props.recorded_video.video_link,
        video_width: appConfig.cameraConstants.VIDEO_WIDTH,
        video_height: appConfig.cameraConstants.VIDEO_HEIGHT,
        image_width: appConfig.cameraConstants.VIDEO_WIDTH,
        image_height: appConfig.cameraConstants.VIDEO_HEIGHT,
        video_size: videoSize,
        image_size: imageSize
      };

      new PepoApi(`/users/${this.props.current_user.id}/fan-video`)
        .post(payload)
        .then((responseData) => {
          if (responseData.success && responseData.data) {
            // this.updateProfileViewVideo(this.props.recorded_video.s3_cover_image, this.props.recorded_video.s3_video);
            console.log('Video uploaded Successfully');
            Toast.show({
              text: 'Your video is uploaded successfully',
              icon: 'success',
              imageUri: this.props.recorded_video.cover_image
            });
            Store.dispatch(
              upsertRecordedVideo({
                do_discard: true,
                pepo_api_posting: false
              })
            );
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
    if (this.props.current_user.id) {
      return `user-${this.props.current_user.id}-recorded_video`;
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

  componentDidMount() {
    // oThis.syncAsyncToRedux();
  }

  render() {
    this.syncAsyncToRedux();
    this.syncReduxToAsync();
    this.processVideo();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({ recorded_video, current_user }) => ({ recorded_video, current_user });

export default connect(mapStateToProps)(CameraWorker);
