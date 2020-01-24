import { Platform } from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import CameraPermissionsApi from '../services/CameraPermissionsApi';
import AppConfig from '../constants/AppConfig';

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

  async _fetchPhotos() {
    if (!this._page_info.has_next_page) return;
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
    const permission = await CameraPermissionsApi.checkPermission('photo');
    if (permission == AppConfig.permisssionStatusMap.granted) {
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

  savePhotoToGallery(imageUri) {
    CameraRoll.saveToCameraRoll(imageUri, 'photo');
  }
}

export default new ImageBrowser();
