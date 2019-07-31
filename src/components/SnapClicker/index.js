import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import inlineStyles from './styles';
import img_capture from '../../assets/image-capture-icon.png';
import CrossIcon from '../../assets/cross_icon_white.png';
import AllowAccessModal from '../Profile/AllowAccessModal';
import CameraIcon from '../../assets/camera_icon.png';
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

  showAppSettings = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <AllowAccessModal
          onClose={() => {
            this.props.navigation.goBack();
          }}
          modalVisibility={true}
          headerText="Camera"
          accessText="Enable Camera Access"
          accessTextDesc="Allow access to your camera to take your profile picture "
          imageSrc={CameraIcon}
        />
      </View>
    );
  };

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
          captureAudio={false}
          notAuthorizedView={this.showAppSettings()}
          pendingAuthorizationView={this.showAppSettings()}
        >
          <TouchableOpacity style={inlineStyles.crossIconWrapper} onPress={this.props.onClose}>
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
