import UploadToS3 from './UploadToS3';
import Store from '../store';
import { upsertRecordedVideo } from '../actions';
import utilities from './Utilities';
import currentUser from '../models/CurrentUser';
import FfmpegProcesser from './FfmpegProcesser';

const androidCameraPermissionOptions = {
  title: 'Permission to use camera',
  message: 'We need your permission to use your camera',
  buttonPositive: 'Ok',
  buttonNegative: 'Cancel'
};

const androidRecordAudioPermissionOptions = {
  title: 'Permission to use audio recording',
  message: 'We need your permission to use your audio',
  buttonPositive: 'Ok',
  buttonNegative: 'Cancel'
};

export const storageKeys = {
  RAW_VIDEO: 'raw-video',
  COMPRESSED_VIDEO: 'compressed-video',
  S3_VIDEO: 's3-video',

  VIDEO_THUMBNAIL_IMAGE: 'video-thumbnail-image',
  S3_VIDEO_THUMBNAIL_IMAGE: 's3-video-thumbnail-image',

  PROFILE_RAW_IMAGE: 'profile-raw-image',
  PROFILE_CROPPED_IMAGE: 'profile-cropped-image',
  S3_PROFILE_IMAGE: 's3-profile-image',
  ENABLE_START_UPLOAD: 'enable-start-upload'
};

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

  async video(file) {
    this.rawVideo = file;
    // save compressed video to redux
    Store.dispatch(
      upsertRecordedVideo({
        raw_video: this.rawVideo
      })
    );
    await this._saveInAsyncStorage(storageKeys['RAW_VIDEO'], this.rawVideo);
  }

  async thambnailHanling(file) {
    this.videoThumbnailImageFile = file;
    Store.dispatch(
      upsertRecordedVideo({
        video_thumbnail_image: this.videoThumbnailImageFile
      })
    );
    await this._saveInAsyncStorage(storageKeys['VIDEO_THUMBNAIL_IMAGE'], this.videoThumbnailImageFile);
    await this.uploadVideoThumbnailImage(file);
  }

  async enableStartUploadFlag() {
    Store.dispatch(
      upsertRecordedVideo({
        enable_start_upload: true
      })
    );

    await this._saveInAsyncStorage(storageKeys['ENABLE_START_UPLOAD'], true);
  }

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
    await this._saveInAsyncStorage(storageKeys['S3_VIDEO_THUMBNAIL_IMAGE'], s3VideoThumbnailImage);
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
    await this._saveInAsyncStorage(storageKeys['COMPRESSED_VIDEO'], this.compressedVideo);
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
    await this._saveInAsyncStorage(storageKeys['S3_VIDEO'], s3Video);
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
    console.log(`_saveInAsyncStorage entity: ${entity}, dataToSave: ${dataToSave}`);
    await utilities.saveItem(currentUser._getASKey(this.currentUser.id, entity), dataToSave);
  }

  async _removeFromAsyncStorage(entity) {
    await utilities.removeItem(currentUser._getASKey(this.currentUser.id, entity));
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

    for (key in storageKeys) {
      await this._removeFromAsyncStorage(storageKeys[key]);
    }
  }
}
export default new CameraManager();
//export { cameraManager: new CameraManager() , androidCameraPermissionOptions, androidRecordAudioPermissionOptions };
