import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, ActivityIndicator } from 'react-native';
import modalStyles from './styles';

const mapStateToProps = ({ modal }) => ({ show: modal.show, message: modal.message });

const LoadingModal = ({ show, message }) => (
  <View>
    <Modal animationType="fade" transparent={true} visible={show} coverScreen={false} hasBackdrop={false}>
      <View style={modalStyles.modalBackground}>
        <View style={modalStyles.activityIndicatorWrapper}>
          <ActivityIndicator size="large" color="#168dc1" />
          <Text style={{ fontSize: 18, marginTop: 20 }}>{message}</Text>
        </View>
      </View>
    </Modal>
  </View>
);

export default connect(mapStateToProps)(LoadingModal);
