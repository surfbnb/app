import UploadToS3 from './UploadToS3';
import Store from '../store';
import { upsertRecordedVideo } from '../actions';
import utilities from './Utilities';
import currentUser from '../models/CurrentUser';
import appConfig from '../constants/AppConfig';
import FfmpegProcesser from './FfmpegProcesser';

class CameraManager {
  constructor() {
    this.currentUser = null;
    this.rawVideo = null;
    this.compressedVideo = null;
    this.s3Video = null;
    this.videoThumbnailImageFile = null;
    this.s3VideoThumbnailImage = null;
    this.profileRawImage = null;
    this.profileCroppedImage = null;
    this.s3ProfileImage = null;
    this._getCurrentUser();
  }

  async initVideo(file) {
    this.rawVideo = file;
    Store.dispatch(
      upsertRecordedVideo({
        raw_video: this.rawVideo
      })
    );
    await this._saveInAsyncStorage(appConfig.storageKeys['RAW_VIDEO'], this.rawVideo);
  }

  async thambnailHanling(file) {
    this.videoThumbnailImageFile = file;
    Store.dispatch(
      upsertRecordedVideo({
        video_thumbnail_image: this.videoThumbnailImageFile
      })
    );
    await this._saveInAsyncStorage(appConfig.storageKeys['VIDEO_THUMBNAIL_IMAGE'], this.videoThumbnailImageFile);
  }

  async enableStartUploadFlag() {
    Store.dispatch(
      upsertRecordedVideo({
        enable_start_upload: true
      })
    );

    await this._saveInAsyncStorage(appConfig.storageKeys['ENABLE_START_UPLOAD'], true);

  getFileExtension(file) {
    let splittedFileName = file.split('.');
    return splittedFileName[splittedFileName.length - 1];
  }

  async uploadVideoThumbnailImage(file) {
    let s3VideoThumbnailImage = await this._uploadToS3(file, 'image');

    Store.dispatch(
      upsertRecordedVideo({
        s3_video_thumbnail_image: s3VideoThumbnailImage
      })
    );
    await this._saveInAsyncStorage(appConfig.storageKeys['S3_VIDEO_THUMBNAIL_IMAGE'], s3VideoThumbnailImage);
    return s3VideoThumbnailImage;
  }

  async compressVideo() {
    let ffmpegProcesser = new FfmpegProcesser(this.rawVideo);
    this.compressedVideo = await ffmpegProcesser.compress();
    Store.dispatch(
      upsertRecordedVideo({
        compressed_video: this.compressedVideo
      })
    );
    await this._saveInAsyncStorage(appConfig.storageKeys['COMPRESSED_VIDEO'], this.compressedVideo);
    return this.compressedVideo;
  }

  async uploadCompressedVideo(file) {
    // redux get compressed Video path : file
    // wait until u get compressed uri

    // upload it to s3
    let s3Video = await this._uploadToS3(file, 'video');

    Store.dispatch(
      upsertRecordedVideo({
        s3_video: s3Video
      })
    );
    await this._saveInAsyncStorage(appConfig.storageKeys['S3_VIDEO'], s3Video);
    // save s3 uri in redux
    return s3Video;
  }

  async _uploadToS3(fileToUpload, fileType) {
    let uploadToS3 = new UploadToS3(fileToUpload, fileType);
    return await uploadToS3.perform();
  }

  _getCurrentUser() {
    this.currentUser = Store.getState().current_user;
  }

  async _saveInAsyncStorage(entity, data) {
    let dataToSave = typeof data === 'string' ? data : JSON.stringify(data);
    console.log(`_saveInAsyncStorage entity: user-1-${entity}, dataToSave: ${dataToSave}`);
    await utilities.saveItem(`user-1-${entity}`, dataToSave);
  }

  async _removeFromAsyncStorage(entity) {
    await utilities.removeItem(`user-1-${entity}`);
  }



  // async getVideUri() {
  //   //TODO: change currentUser.id to actual user
  //   let resp = await utilities.getItem(currentUser._getASKey(this.currentUser.id, 'recorded-video'));
  //   console.log(resp, 'getVideoUrl');
  // }

  async cleanUp() {
    // stop ffmpge processing
    Store.dispatch(
      upsertRecordedVideo({
        raw_video: undefined,
        compressed_video: undefined,
        s3_video: undefined,
        video_thumbnail_image: undefined,
        s3_video_thumbnail_image: undefined,
        enable_start_upload: undefined
      })
    );

    for (var key in appConfig.storageKeys) {
      await this._removeFromAsyncStorage(appConfig.storageKeys[key]);
    }
  }


}

export default new CameraManager();
