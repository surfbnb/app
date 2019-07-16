import { CameraRoll, PermissionsAndroid } from 'react-native';

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

  async requestExternalStoreageRead() {
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

  async _getPhotosAsync() {
    if (await this.requestExternalStoreageRead()) {
      const result = await CameraRoll.getPhotos({
        first: 9,
        assetType: 'Photos'
      });
      this.onSuccess(result);
    }
  },

  onSuccess(result) {
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
