import React from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';

import ImageCropper from './index';
import appConfig from '../../constants/AppConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

export default class CropperUI extends React.Component {
  state = {
    cropperParams: {},
    croppedImage: ''
  };

  setCropperParams = (cropperParams) => {
    this.setState((prevState) => ({
      ...prevState,
      cropperParams
    }));
  };

  cropImage = async () => {
    const { cropperParams } = this.state;
    const cropSize = {
      width: appConfig.cameraCropConstants.WIDTH,
      height: appConfig.cameraCropConstants.WIDTH
    };

    try {
      const result = await ImageCropper.crop({
        ...cropperParams,
        imageUri: this.props.imageUri,
        cropSize
      });
      this.setState((prevState) => ({
        ...prevState
      }));
      this.props.onCrop(result);
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    let { width, height } = Dimensions.get('window');
    let verticalPadding = 55;
    let horzPadding = 30;
    let totalHorzPadding = 2 * horzPadding;
    let x = width - totalHorzPadding;
    let overlayDim = 3 * x;
    let borderRadius = (3 * x) / 2;
    let borderWidth = x;

    return (
      <View style={styles.container}>
        <View style={{ position: 'relative' }}>
          <ImageCropper
            heightRatio={this.props.screenHeightRatio}
            imageUri={this.props.imageUri}
            setCropperParams={this.setCropperParams}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: horzPadding - x,
              left: horzPadding - x,
              height: overlayDim,
              width: overlayDim,
              backgroundColor: 'transparent',
              borderWidth: borderWidth,
              borderRadius: borderRadius,
              borderColor: 'rgba(0, 0, 0, 0.5)'
            }}
          ></View>
        </View>
      </View>
    );
  }
}
