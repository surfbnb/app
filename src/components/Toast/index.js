import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text } from 'react-native';
import { showToast, hideToast } from '../../actions';
import Store from '../../store';

import toastStyles from './styles';

const mapStateToProps = ({ toast }) => ({ show: toast.show, message: toast.message });

const Toast = ({ show, message }) => {
  const hideAfterTimeout = () => {
    if (show) {
      setTimeout(() => Store.dispatch(hideToast()), 3000);
    }
  };
  return (
    <View>
      {hideAfterTimeout()}
      <Modal animationType="fade" transparent={true} visible={show} coverScreen={false} hasBackdrop={false}>
        <View style={toastStyles.modalContentWrapper}>
          <Text style={toastStyles.message}>{message}</Text>
        </View>
      </Modal>
    </View>
  );
};

export default connect(mapStateToProps)(Toast);
