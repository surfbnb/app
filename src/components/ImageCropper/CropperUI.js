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
    let verticalPadding = 40;
    let horzPadding = 30;
    let totalHorzPadding = 2 * horzPadding;
    let x = width - totalHorzPadding;
    let overlayDim = 3 * x;
    let borderRadius = (3 * x) / 2;
    let borderWidth = x;

    return (
      <SafeAreaView style={styles.container}>
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
              top: verticalPadding - x,
              left: horzPadding - x,
              height: overlayDim,
              width: overlayDim,
              backgroundColor: 'transparent',
              borderWidth: borderWidth,
              borderRadius: borderRadius,
              borderColor: 'rgba(0, 0, 0, 0.5)'
            }}
          ></View>
          <TouchableOpacity
            style={inlineStyles.crossIconWrapper}
            onPress={this.props.onClose}
          >
            <Image style={inlineStyles.crossIconSkipFont} source={CrossIcon} />
          </TouchableOpacity>
          <Text style={{ position: 'absolute', flex: 1, alignSelf: 'center', marginTop: 10, color: '#ffffff' }}>
            Crop
          </Text>
        </View>
      </SafeAreaView>
    );
  }
}
