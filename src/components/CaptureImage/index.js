import React, { Component } from 'react';

import SnapClicker from '../SnapClicker';
import ImageCropper from '../ImageCropper';
import ImageBrowser from '../../services/ImageBrowser';
import UploadToS3 from '../../services/UploadToS3';

class CaptureImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI: '',
      imageCaptured: false
    };
  }

  getView() {
    if (this.state.imageCaptured) {
      return <ImageCropper imageURI={this.state.imageURI} onCrop={this.getCroppedImage} onClose={this.closeCropper} />;
    } else {
      return this.getCameraView();
    }
  }

  closeCamera = () => {
    this.navigateBack();
  };

  closeCropper = () => {
    this.navigateBack();
  };

  navigateBack() {
    this.props.navigation.navigate('ProfileImagePicker');
  }

  async getCroppedImage(imageUri) {
    if (!imageUri) return;
    const uploadToS3 = new UploadToS3(imageUri, 'image');
    const s3Url = await uploadToS3.perform();
    console.log('image upload url', s3Url);
  }

  toggleView = (imageURI = '') => {
    if (imageURI) {
      this.setState({
        imageCaptured: !this.state.imageCaptured,
        imageURI
      });
      ImageBrowser.savePhotoToGallery(imageURI);
    }
  };

  getCameraView() {
    return <SnapClicker onSnap={this.toggleView} onClose={this.closeCamera} />;
  }

  render() {
    return this.getView();
  }
}

export default CaptureImage;
