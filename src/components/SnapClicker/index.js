import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';

import { RNCamera } from 'react-native-camera';

class SnapClicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageURI: ''
    };
    this.camera = null;
  }

  captureImage = () => {
    console.log('i am clicked!!');
  };

  render() {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={(ref) => {
            this.camera = ref;
          }}
          style={styles.preview}
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
          androidRecordAudioPermissionOptions={{
            title: 'Permission to use audio recording',
            message: 'We need your permission to use your audio',
            buttonPositive: 'Ok',
            buttonNegative: 'Cancel'
          }}
        >
          <View
            style={{
              flex: 0,
              flexDirection: 'row',
              justifyContent: 'center'
            }}
          >
            {/* action button comes here */}
            <Button
              title="Click me!"
              onPress={() => {
                this.captureImage();
              }}
            />
          </View>
        </RNCamera>
      </View>
    );
  }
}

export default SnapClicker;
