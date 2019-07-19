import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import RNThumbnail from 'react-native-thumbnail';
import RNFS from 'react-native-fs';
import Store from '../store';
import {
  upsertRecordedVideo,
  clearRecordedVideo,
  upsertImageEntities,
  upsertVideoEntities,
  upsertUserProfileEntities,
  videoInProcessing
} from '../actions';
import utilities from './Utilities';
import appConfig from '../constants/AppConfig';
import FfmpegProcesser from './FfmpegProcesser';
import UploadToS3 from './UploadToS3';
import PepoApi from './PepoApi';
import ReduxGetters from './ReduxGetters';
import CurrentUser from '../models/CurrentUser';
import createObjectForRedux from '../helpers/createObjectForRedux';
const recordedVideoStates = ['raw_video', 'compressed_video', 's3_video', 'cover_image', 's3_cover_image'];

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
      this.updateProfileViewVideo(this.props.recorded_video.cover_image, this.props.recorded_video.raw_video);
    }
  }

  async cleanUp() {
    // stop ffmpge processing
    Store.dispatch(videoInProcessing(false));
    this.ffmpegProcesser && this.ffmpegProcesser.cancel();

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
    if (
      this.props.recorded_video.raw_video &&
      !this.props.recorded_video.cover_capture_processing &&
      !this.props.recorded_video.cover_image
    ) {
      Store.dispatch(videoInProcessing(true));
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
              cover_image: coverImage
            })
          );
        })
        .catch(() => {
          Store.dispatch(
            upsertRecordedVideo({
              cover_capture_processing: false
            })
          );
        });
    }
  }

  async compressVideo() {
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

      FfmpegProcesser.init(this.props.recorded_video.raw_video);

      let compressedVideo = await FfmpegProcesser.compress();
      Store.dispatch(
        upsertRecordedVideo({
          compressed_video: compressedVideo
        })
      );
    }
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
    Store.dispatch(
      upsertUserProfileEntities({
        [`id_${CurrentUser.getUserId()}`]: {
          ...ReduxGetters.getCurrentUserProfile(),
          ...{ cover_image_id: imageObject.key, cover_video_id: videoObject.key }
        }
      })
    );
  }

  async uploadVideo() {
    if (this.props.recorded_video.compressed_video && !this.props.recorded_video.video_s3_upload_processing) {
      Store.dispatch(
        upsertRecordedVideo({
          video_s3_upload_processing: true
        })
      );

      this.uploadToS3(this.props.recorded_video.compressed_video, 'video')
        .then((s3Video) => {          
          Store.dispatch(
            upsertRecordedVideo({
              s3_video: s3Video
            })
          );
        })
        .catch(() => {
          Store.dispatch(
            upsertRecordedVideo({
              video_s3_upload_processing: false
            })
          );
        });
    }
  }

  async uploadCoverImage() {
    if (this.props.recorded_video.cover_image && !this.props.recorded_video.cover_s3_upload_processing) {
      Store.dispatch(
        upsertRecordedVideo({
          cover_s3_upload_processing: true
        })
      );

      this.uploadToS3(this.props.recorded_video.cover_image, 'image')
        .then((s3CoverImage) => {          
          Store.dispatch(
            upsertRecordedVideo({
              s3_cover_image: s3CoverImage
            })
          );
        })
        .catch(() => {
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
    if (this.props.recorded_video.s3_video && this.props.recorded_video.s3_cover_image && !this.postToPepoApi) {
      this.postToPepoApi = true;
      let videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
      let videoSize = videoInfo.size;
      let imageInfo = await RNFS.stat(this.props.recorded_video.cover_image);
      let imageSize = imageInfo.size;

      let payload = {
        video_url: this.props.recorded_video.s3_video,
        poster_image_url: this.props.recorded_video.s3_cover_image,
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
            this.updateProfileViewVideo(this.props.recorded_video.s3_cover_image, this.props.recorded_video.s3_video);
            Store.dispatch(
              upsertRecordedVideo({
                do_discard: true
              })
            );
          }
          this.postToPepoApi = false;
        })
        .catch(() => {
          // cancel workflow.
          this.postToPepoApi = false;
          ostDeviceRegistered.cancelFlow();
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
