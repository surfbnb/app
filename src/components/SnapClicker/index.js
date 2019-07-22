import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import inlineStyles from './styles';
import img_capture from '../../assets/image-capture-icon.png';
import CrossIcon from '../../assets/cross_icon_white.png';

import { RNCamera } from 'react-native-camera';

class SnapClicker extends Component {
  constructor(props) {
    super(props);
    this.camera = null;
  }

  captureImage = async () => {
    if (this.camera) {
      const options = {
        quality: 0.5,
        base64: true,
        mirrorImage: true,
        forceUpOrientation: true,
        fixOrientation: true // needed on some android devices
      };
      const data = await this.camera.takePictureAsync(options);
      let obj = {
        uri: data.uri,
        type: 'image/jpeg',
        name: 'image.jpg'
      };
      this.props.onSnap(obj.uri);
    }
  };

  componentWillUnmount() {
    this.camera = null;
  }

  render() {
    return (
      <View style={inlineStyles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={inlineStyles.previewSkipFont}
          type={RNCamera.Constants.Type.front}
          ratio="16:9"
          zoom={0}
          autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
          notAuthorizedView={
            <View>
              <Text>The camera is not authorized!</Text>
            </View>
          }
          pendingAuthorizationView={
            <View>
              <Text>The camera is pending authorization!</Text>
            </View>
          }
          androidCameraPermissionOptions={{
            title: 'Permission to use camera',
            message: 'We need your permission to use your camera',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel'
          }}
        >
          <TouchableOpacity style={inlineStyles.crossIconWrapper}  onPress={this.props.onClose}>
            <Image style={inlineStyles.crossIconSkipFont} source={CrossIcon} />
          </TouchableOpacity>
          {/* action button comes here */}
          <TouchableOpacity onPress={this.captureImage} style={inlineStyles.captureBtn}>
            <Image style={inlineStyles.imgCaptureButtonSkipFont} source={img_capture} />
          </TouchableOpacity>
        </RNCamera>
      </View>
    );
  }
}

export default SnapClicker;
