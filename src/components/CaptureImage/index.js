import React, { Component } from 'react';

import SnapClicker from '../SnapClicker';
import ImageCropper from '../ImageCropper';
import ImageBrowser from '../../services/ImageBrowser';

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

  getCroppedImage(imageUri) {}

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
