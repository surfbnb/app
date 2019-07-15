import React, { Component } from 'react';

import SnapClicker from '../SnapClicker';
import ImageCropper from '../ImageCropper';

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
      return <ImageCropper imageURI={this.state.imageURI} onCrop={this.getCroppedImage} />;
    } else {
      return this.getCameraView();
    }
  }

  getCroppedImage() {}

  toggleView() {
    this.setState({
      imageCaptured: !this.state.imageCaptured
    });
  }

  getCameraView() {
    return <SnapClicker onSnap={this.toggleView} />;
  }

  render() {
    return this.getView();
  }
}

export default CaptureImage;
