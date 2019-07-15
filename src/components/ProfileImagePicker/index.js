import React from 'react';
import { View, StyleSheet, Button } from 'react-native';
import { ActionSheet } from 'native-base';

const BUTTONS = ['Take Photo', 'Choose from Library', 'Cancel'];
const OPEN_CAMERA = 0;
const OPEN_GALLERY = 1;
const CANCEL_INDEX = 2;

class ProfileImagePicker extends React.Component {
  constructor(props) {
    super(props);
  }

  showActionSheetWithOptions = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX
      },
      (buttonIndex) => {
        buttonIndex === OPEN_CAMERA && this.openCamera();
        buttonIndex === OPEN_GALLERY && this.openGallery();
      }
    );
  };

  openCamera = () => {
    console.log('camera is opened');
    this.props.navigation.navigate('CaptureImageScreen');
  };

  openGallery = () => {
    console.log('gallery is opened');
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Select Picture" onPress={this.showActionSheetWithOptions}></Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2c3e50'
  }
});

export default ProfileImagePicker;
