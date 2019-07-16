import { CameraRoll, PermissionsAndroid, Platform } from 'react-native';

const ImageBrowser = {
  _page_info: null,
  _photos: null,

  init() {
    this._photos = null;
    this._page_info = {
      has_next_page: true,
      start_cursor: '',
      end_cursor: ''
    };
  },

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
  },

  async _fetchPhotos() {
    let params = {
      first: 9,
      assetType: 'Photos'
    };
    if (this._page_info && this._page_info.end_cursor) {
      params.after = this._page_info.end_cursor;
    }
    if (Platform.OS === 'ios') {
      params.groupTypes = 'All';
    }
    try {
      const result = await CameraRoll.getPhotos(params);
      this._onSuccess(result);
    } catch (err) {
      alert('Fetch photos failed!', err);
    }
  },

  async _getPhotosAsync() {
    if (Platform.OS === 'android') {
      const hasPermission = await this._requestExternalStorageRead();
      if (hasPermission) {
        await this._fetchPhotos();
      }
    } else if (Platform.OS === 'ios') {
      await this._fetchPhotos();
    }
    console.log('i m here');
  },

  _onSuccess(result) {
    if (!result) return;
    this._photos = result.edges;
    this._page_info = result.page_info;
    console.log('page info', this._page_info);
  },

  hasNextPage() {
    return this._page_info.hasNextPage;
  },

  async getPhotos() {
    await this._getPhotosAsync();
    return this._photos;
  }
};

export default ImageBrowser;
