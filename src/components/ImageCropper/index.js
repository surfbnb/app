import React, { Component } from 'react';
import { View, Button } from 'react-native';

class ImageCropper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageUri: ''
    };
  }

  componentDidMount() {}

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
