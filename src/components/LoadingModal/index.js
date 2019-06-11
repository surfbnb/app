import React, { Component } from 'react';
import { View, Modal, Text, ActivityIndicator } from 'react-native';
import modalStyles from './styles';

export default class LoadingModal extends Component {
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
              <ActivityIndicator size="large" color="#168dc1" />
              <Text style={{ fontSize: 18, marginTop: 20 }}>{this.props.loadingText}</Text>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
