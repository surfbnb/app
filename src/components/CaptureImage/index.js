import React, { Component } from 'react';

import SnapClicker from '../SnapClicker';
import CropperUI from '../ImageCropper/CropperUI';
import store from '../../store';
import {upsertProfilePicture} from '../../actions';

import { Platform, Image, TouchableWithoutFeedback, View, SafeAreaView } from 'react-native';

import UploadToS3 from '../../services/UploadToS3';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import CurrentUser from '../../models/CurrentUser';
import PepoApi from '../../services/PepoApi';
import appConfig from '../../constants/AppConfig';
import tickIcon from '../../assets/tick_icon.png';


class CaptureImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI: '',
      imageCaptured: false
    };
    this.cropperRef = null;
  }

  static navigationOptions = ({navigation, navigationOptions}) => {
    return {
      header: null
    };
  }

  componentWillUnmount() {
    this.cropperRef = null;
  }

  cropImage = () => {
    if (this.cropperRef) {
      this.cropperRef.cropImage();
    }
  };

  getView() {
    if (this.state.imageCaptured) {
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View style={{ position: 'relative', flex: 0.6 }}>
            <CropperUI
              ref={(ref) => (this.cropperRef = ref)}
              imageUri={this.state.imageURI}
              screenHeightRatio={0.6}
              onCrop={this.getCroppedImage}
              onClose={this.closeCropper}
            />
          </View>
          <View style={{ flex: 0.4, backgroundColor: '#000000' }}>
            <TouchableWithoutFeedback onPress={this.cropImage}>
              <Image
                source={tickIcon}
                style={{
                  position: 'absolute',
                  bottom: 22,
                  right: 22,
                  width: 45,
                  height: 45
                }}
              />
            </TouchableWithoutFeedback>
          </View>
        </SafeAreaView>
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
    //this.props.navigation.navigate('ProfileScreen');
    this.props.navigation.goBack();
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
