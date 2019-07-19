import React, { Component } from 'react';


import SnapClicker from '../SnapClicker';
import CropperUI from '../ImageCropper/CropperUI';
import store from '../../store';
import {upsertProfilePicture} from '../../actions';

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
      return (
        <CropperUI
          imageUri={this.state.imageURI}
          screenHeightRatio={1}
          onCrop={this.getCroppedImage}
          onClose={this.closeCropper}
        />
      );
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
    this.props.navigation.navigate('ProfileScreen');
  }

  getCroppedImage = (imageUri) => {
    store.dispatch(
      upsertProfilePicture({
        cropped_image: imageUri
      })
    );
    this.closeCropper();
  };

  toggleView = (imageURI = '') => {
    console.log('imageURI raw', imageURI);
    if (imageURI) {
      this.setState({
        imageCaptured: !this.state.imageCaptured,
        imageURI
      });
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
