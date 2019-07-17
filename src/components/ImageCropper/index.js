import React, { Component } from 'react';
import { View, Button } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: ''
    };
  }

  componentDidMount() {
    const promise = ImagePicker.openCropper({
      path: this.props.imageURI,
      width: 100,
      height: 100,
      cropperCircleOverlay: true,
      cropperToolbarTitle: 'Crop',
      useFrontCamera: true,
      compressImageMaxWidth: 500,
      compressImageMaxHeight: 500,
      // cropperChooseText: '',
      // cropperCancelText: '',
      hideBottomControls: true
    })
      .then((image) => {
        if (image && image.path) {
          this.setState({
            imageUri: image.path
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <View>
        <Button title="close cropper" onPress={this.props.onClose}></Button>
        <Button
          title="confirm"
          onPress={() => {
            this.props.onCrop(this.state.imageUri);
          }}
        ></Button>
      </View>
    );
  }
}

export default ImageCropper;
