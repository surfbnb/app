import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import RNThumbnail from 'react-native-thumbnail';
import RNFS from 'react-native-fs';

import Store from '../store';
import { upsertRecordedVideo, clearRecordedVideo, clearRecordeVideo } from '../actions';
import utilities from './Utilities';
import appConfig from '../constants/AppConfig';
import FfmpegProcesser from './FfmpegProcesser';
import UploadToS3 from './UploadToS3';
import PepoApi from './PepoApi';

const VIDEO_WIDTH = 720;
const VIDEO_HEIGHT = 1280;

const recordedVideoStates = ['raw_video', 'compressed_video', 's3_video', 'cover_image', 's3_cover_image'];

const recordedVideoActions = ['do_upload', 'do_discard'];

class CameraWorker extends PureComponent {
  constructor() {
    super();
  }

  syncAsyncToRedux() {
    // Early exit
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
        console.log('syncAsyncToRedux :: Data synced from Async to recorded_video');
      });
    } else {
      console.log('syncAsyncToRedux :: No data found to sync');
    }
  }

  syncReduxToAsync() {
    // Need to sync
    if (this.getCurrentUserRecordedVideoKey()) {
      utilities.saveItem(this.getCurrentUserRecordedVideoKey(), this.getDataforAsync()).then(() => {
        console.log('syncReduxToAsync :: Data synced from recorded_video to Async');
      });
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
      this.compressVideoAndCreateThumbnail();
      console.log('processVideo :: No upload consent. Taking cover image...');
      //  this.captureCoverImage();
      return;
    }

    if (this.props.recorded_video.do_upload) {
      console.log(
        'processVideo :: Got upload consent. Uploading video and cover image to s3 and attempting post Video with Cover Image...'
      );
      await this.uploadVideo();
      await this.uploadCoverImage();
      this.postVideoWithCoverImage();
    }
  }

  async cleanUp() {
    // stop ffmpge processing
    this.ffmpegProcesser.cancel();

    // remove files from cache,
    await this.removeFile(this.props.recorded_video.raw_video);
    await this.removeFile(this.props.recorded_video.compressed_video);
    await this.removeFile(this.props.recorded_video.cover_image);
    // Cleaning up Async
    utilities.removeItem(this.getCurrentUserRecordedVideoKey());
    // cleanup Redux
    Store.dispatch(clearRecordeVideo());
  }

  async removeFile(file) {
    let isFileExists = await RNFS.exists(file);
    if (isFileExists) {
      await RNFS.unlink(file);
      return true;
    }
    return false;
  }

  async compressVideoAndCreateThumbnail() {
    if (this.props.recorded_video.raw_video && !this.props.recorded_video.compressed_video) {
      this.ffmpegProcesser = new FfmpegProcesser(this.props.recorded_video.raw_video);
      let compressedVideo = await this.ffmpegProcesser.compress();
      Store.dispatch(
        upsertRecordedVideo({
          compressed_video: compressedVideo
        })
      );

      let coverImage = await this.ffmpegProcesser.getVideoThumbnail();
      Store.dispatch(
        upsertRecordedVideo({
          cover_image: coverImage
        })
      );
    }
  }

  async uploadVideo() {
    if (this.props.recorded_video.compressed_video && !this.props.recorded_video.s3_video) {
      let s3Video = await this._uploadToS3(this.props.recorded_video.compressed_video, 'video');
      Store.dispatch(
        upsertRecordedVideo({
          s3_video: s3Video
        })
      );
    }
  }

  async uploadCoverImage() {
    if (this.props.recorded_video.cover_image && !this.props.recorded_video.s3_cover_image) {
      let s3CoverImage = await this._uploadToS3(this.props.recorded_video.cover_image, 'image');
      Store.dispatch(
        upsertRecordedVideo({
          s3_cover_image: s3CoverImage
        })
      );
    }
  }

  async _uploadToS3(fileToUpload, fileType) {
    let uploadToS3 = new UploadToS3(fileToUpload, fileType);
    return await uploadToS3.perform();
  }

  async postVideoWithCoverImage() {
    if (this.props.recorded_video.s3_video && this.props.recorded_video.s3_cover_image && !this.postToPepoApi) {
      this.postToPepoApi = true;
      let videoInfo = await RNFS.stat(this.props.recorded_video.compressed_video);
      let videoSize = videoInfo.size;
      let imageInfo = await RNFS.stat(this.props.recorded_video.cover_image);
      let imageSize = imageInfo.size;

      let payload = {
        s3_fan_video_url: this.props.recorded_video.s3_video,
        s3_video_poster_image_url: this.props.recorded_video.s3_cover_image,
        video_width: VIDEO_WIDTH,
        video_height: VIDEO_HEIGHT,
        image_width: VIDEO_WIDTH,
        image_height: VIDEO_HEIGHT,
        video_size: videoSize,
        image_size: imageSize
      };

      new PepoApi(`/users/${this.props.current_user.id}/fan-video`)
        .post(payload)
        .then((responseData) => {
          if (responseData.success && responseData.data) {
            console.log('responseData.data', responseData.data);
          }
        })
        .catch(() => {
                  
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
    this.syncAsyncToRedux();
  }

  render() {
    this.syncReduxToAsync();
    this.processVideo();
    return <React.Fragment />;
  }
}

const mapStateToProps = ({ recorded_video, current_user }) => ({ recorded_video, current_user });

export default connect(mapStateToProps)(CameraWorker);
