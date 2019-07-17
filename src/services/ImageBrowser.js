import { CameraRoll, PermissionsAndroid, Platform } from 'react-native';

class ImageBrowser {
  constructor() {
    this._page_info = null;
    this.init();
  }

  init() {
    this._page_info = {
      has_next_page: true,
      start_cursor: '',
      end_cursor: ''
    };
    this.savedStartCursor = '';
  }

  async _requestExternalStorageRead() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        title: '“Pepo” Wants to access to photo library',
        message: 'Please allow access to photo library to select your profile picture'
      });
      return Promise.resolve(granted == PermissionsAndroid.RESULTS.GRANTED);
    } catch (err) {
      console.log('Permission not granted!');
    }
  }

  async _fetchPhotos() {
    console.log(this.savedStartCursor, this._page_info.end_cursor);
    if (this.savedStartCursor && this.savedStartCursor == this._page_info.end_cursor) {
      return false;
    }
    let params = {
      first: 9,
      assetType: 'Photos'
    };
    if (this._page_info && this._page_info.end_cursor) {
      params.after = this._page_info.end_cursor;
      if (!this.savedStartCursor) {
        this.savedStartCursor = this._page_info.start_cursor;
      }
    }
    if (Platform.OS === 'ios') {
      params.groupTypes = 'All';
    }
    try {
      const result = await CameraRoll.getPhotos(params);
      this._page_info = result.page_info;
      return result;
    } catch (err) {
      alert('Fetch photos failed!', err);
      return false;
    }
  }

  async _getPhotosAsync() {
    if (Platform.OS === 'android') {
      const hasPermission = await this._requestExternalStorageRead();
      if (hasPermission) {
        return await this._fetchPhotos();
      }
    } else if (Platform.OS === 'ios') {
      return await this._fetchPhotos();
    }
  }

  hasNextPage() {
    return this._page_info.has_next_page;
  }

  async getPhotos() {
    const result = await this._getPhotosAsync();
    return result && result.edges;
  }
}

export default new ImageBrowser();
