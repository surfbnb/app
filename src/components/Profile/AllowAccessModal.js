import React, { PureComponent } from 'react';
import { View, Text, Modal, Image, TouchableOpacity, Linking } from 'react-native';

import inlineStyles from './styles';
import crossIcon from '../../assets/cross_icon.png';
import CameraPermissionsApi from '../../services/CameraPermissionsApi';

export default class AllowAccessModal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: props.modalVisibility
    };
  }

  setModalVisibility = (visibleVal) => {
    this.setState({
      modalVisible: visibleVal
    });
    this.props.onClose();
  };

  componentDidUpdate(prevProps) {
    if (prevProps.modalVisibility != this.props.modalVisibility) {
      this.setModalVisibility(this.props.modalVisibility);
    }
  }

  enableAccess() {
    Linking.canOpenURL('app-settings:')
      .then((supported) => {
        if (!supported) {
          console.log("Can't handle settings url");
        } else {
          return Linking.openURL('app-settings:');
        }
      })
      .catch((err) => console.error('An error occurred', err));
  }

  render() {
    return (
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setModalVisibility(false);
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={inlineStyles.allowAccessheader}>
            <TouchableOpacity
              onPress={() => {
                this.setModalVisibility(false);
              }}
              style={inlineStyles.crossIconWrapper}
            >
              <Image style={inlineStyles.crossIconDimSkipFont} source={crossIcon}></Image>
            </TouchableOpacity>
            <Text style={inlineStyles.headerText}>{this.props.headerText}</Text>
          </View>
          <View style={inlineStyles.accessAllowContent}>
            <Image source={this.props.imageSrc} style={[inlineStyles.imageDimSkipFont, this.props.imageSrcStyle]} />
            <Text style={inlineStyles.accessTextDesc}>{this.props.accessTextDesc}</Text>
            <TouchableOpacity onPress={this.enableAccess}>
              <Text style={inlineStyles.accessText}>{this.props.accessText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}
