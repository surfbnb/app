import UploadToS3 from './UploadToS3';
import Store from '../store';
import utilities from './Utilities';
import currentUser from '../models/CurrentUser';

export default class CameraManager {
  constructor(file) {
    this.file = file;
    this.currentUser = this.getCurrentUser();
    console.log(this.currentUser, 'currentUser');
  }

  static androidCameraPermissionOptions = {
    title: 'Permission to use camera',
    message: 'We need your permission to use your camera',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel'
  };

  static androidRecordAudioPermissionOptions = {
    title: 'Permission to use audio recording',
    message: 'We need your permission to use your audio',
    buttonPositive: 'Ok',
    buttonNegative: 'Cancel'
  };

  async compressAndUploadVideo() {
    this.fileType = 'video';
    let compressedUri = await this.compressVideo(),
      fileToUpload = { ...this.file, ...{ uri: compressedUri }};

    await this.uploadToS3(fileToUpload);

    await this.setMediaUriInAsyncStorage('recorded-video');

    return this.s3Url;
  }

  async uploadImage(entity){
      this.fileType = 'image';
      await this.uploadToS3(this.file);

      await this.setMediaUriInAsyncStorage(entity);
      

      return this.s3Url;

  }

  async uploadToS3(fileToUpload) {
    let uploadToS3 = new UploadToS3(fileToUpload, this.fileType);
    this.s3Url = await uploadToS3.perform();           
  }

  getCurrentUser() {
    return Store.getState().current_user;
  }

  async setMediaUriInAsyncStorage(entity) {
    console.log(currentUser._getASKey(this.currentUser.id, entity), "currentUser._getASKey(this.currentUser.id, entity)");  
    await utilities.saveItem(currentUser._getASKey(this.currentUser.id, entity), this.s3Url);
  }

  async getVideUri() {
    //TODO: change currentUser.id to actual user
    let resp = await utilities.getItem(currentUser._getASKey(this.currentUser.id, 'recorded-video'));    
    console.log(resp, 'getVideoUrl');
  }

  async compressVideo() {
    //todo: Compress video here
    return this.file.uri;
  }

  async setCompressedVideoLocalUri() {}

  async cleanupLocalVideoUris() {}
}
