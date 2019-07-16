import { CameraRoll, PermissionsAndroid, Platform } from 'react-native';

const ImageBrowser = {
  _page_info: null,
  _photos: null,

  init() {
    this.photos = null;
    this._page_info = {
      has_next_page: true,
      start_cursor: '',
      end_cursor: ''
    };
  },

  async _requestExternalStoreageRead() {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
        title: '“Pepo” Wants to access to photo library',
        message: 'Please allow access to photo library to select your profile picture'
      });

      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log('Permission not granted!');
    }
  },

  async _fetchPhotos() {
    let result = null;
    try {
      result = await CameraRoll.getPhotos({
        first: 9,
        assetType: 'Photos',
        groupTypes: 'All'
      });
      this._onSuccess(result);
    } catch {
      alert('Fetch photos failed!');
    }
  },

  async _getPhotosAsync() {
    if (Platform.OS === 'android') {
      if (await this._requestExternalStoreageRead()) {
        await this._fetchPhotos();
      }
    } else if (Platform.OS === 'ios') {
      await this._fetchPhotos();
    }
  },

  _onSuccess(result) {
    if (!result) return;
    this.photos = result.edges;
    this.page_info = result.page_info;
  },

  hasNextPage() {
    return this.page_info.hasNextPage;
  },

  async getPhotos() {
    await this._getPhotosAsync();
    return this.photos;
  }
};

export default ImageBrowser;
