import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, SafeAreaView } from 'react-native';

import ImageCropper from './index';
import appConfig from '../../constants/AppConfig';
import CrossIcon from '../../assets/cross_icon_white.png';
import inlineStyles from './styles';

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

const verticalPadding = 40;
const horzPadding = 30;
const { width, height } = Dimensions.get('window');
const totalHorzPadding = 2 * horzPadding;
const circleWidth = width - totalHorzPadding;

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
        cropSize,
        verticalPadding,
        horzPadding,
        circleWidth
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
    let overlayDim = 3 * circleWidth;
    let borderRadius = (3 * circleWidth) / 2;
    let borderWidth = circleWidth;

    return (
      <View style={styles.container}>
        <View style={{ position: 'relative', flex: 1 }}>
          <ImageCropper
            heightRatio={this.props.screenHeightRatio}
            imageUri={this.props.imageUri}
            setCropperParams={this.setCropperParams}
          />
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: verticalPadding - circleWidth,
              left: horzPadding - circleWidth,
              height: overlayDim,
              width: overlayDim,
              backgroundColor: 'transparent',
              borderWidth: borderWidth,
              borderRadius: borderRadius,
              borderColor: 'rgba(0, 0, 0, 0.5)'
            }}
          ></View>
          <TouchableOpacity style={inlineStyles.crossIconWrapper} onPress={this.props.onClose}>
            <Image style={inlineStyles.crossIconSkipFont} source={CrossIcon} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', flex: 1, alignSelf: 'center', marginTop: 10, color: '#ffffff' }}>
            Crop
          </Text>
        </View>
      </View>
    );
  }
}
