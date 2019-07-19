import React from 'react';
import { View, Image, TouchableWithoutFeedback, StyleSheet, Dimensions } from 'react-native';

import ImageCropper from './index';
import tickIcon from '../../assets/tick_icon.png';
import appConfig from '../../constants/AppConfig';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
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

  handlePress = async () => {
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
    return (
      <View style={styles.container}>
        <View style={{ position: 'relative', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <ImageCropper
            heightRatio={this.props.screenHeightRatio}
            imageUri={this.props.imageUri}
            setCropperParams={this.setCropperParams}
          />
          <View
            style={{
              position: 'absolute'
            }}
          >
            {/* <View
              pointerEvents="box-none"
              style={{
                top: -width / 2 + 30,
                left: -width / 2 + 30,
                right: -width / 2 + 30,
                bottom: -width / 2 + 30,
                backgroundColor: 'transparent',

                borderWidth: width / 2,
                borderRadius: width,
                borderColor: 'rgba(0, 0, 0, 0.99)',
                opacity: 0.5
              }}
            ></View> */}
            <TouchableWithoutFeedback onPress={this.handlePress}>
              <Image source={tickIcon} style={{ width: 45, height: 45, marginRight: 22.5, marginBottom: 22.5 }} />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}
