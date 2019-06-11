import React, { Component } from 'react';
import { View, Modal, Text, ActivityIndicator } from 'react-native';
import modalStyles from './styles';

export default class CustomModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.show}
          coverScreen={false}
          hasBackdrop={false}
        >
          <View style={modalStyles.modalBackground}>
            <View style={modalStyles.activityIndicatorWrapper}>
              <Text style={{ fontSize: 18 }}>{this.props.loadingText}</Text>
              <ActivityIndicator size="small" color="#00ff00" />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
