import React, { Component } from 'react';
import { Platform } from 'react-native';

import SnapClicker from '../SnapClicker';
import CropperUI from '../ImageCropper/CropperUI';
import UploadToS3 from '../../services/UploadToS3';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';

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
    this.props.navigation.navigate('ProfileImagePicker');
  }

  getCroppedImage = async (imageUri) => {
    if (!imageUri) return;

    if (Platform.OS === 'ios') {
      const outputPath = `${RNFS.CachesDirectoryPath}/Pepo/${new Date().getTime()}.jpg`;
      // The imageStore path here is "rct-image-store://0"
      ImageResizer.createResizedImage(imageUri, 100, 100, 'JPEG', 25, 0, outputPath)
        .then(async (success) => {
          await this.uploadToS3(success.path);
        })
        .catch((err) => {
          console.log('Could not get resized image', err);
        });
    } else {
      await this.uploadToS3(imageUri);
    }
  };

  uploadToS3 = async (uri) => {
    const uploadToS3 = new UploadToS3(uri, 'image');
    const s3Url = await uploadToS3.perform();
    console.log('image upload url', s3Url);
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
