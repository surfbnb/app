import React from 'react';
import { connect } from 'react-redux';
import {View, Modal, Text, Image, Animated, Easing, Platform, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';

import inlineStyles from './styles';
import failureImage from "../../../assets/toast_error.png";
import successImage from '../../../assets/toast_success.png'
import Store from '../../../store';
import {showAlert, hideAlert} from '../../../actions';
import LinearGradient from 'react-native-linear-gradient';
import Theme from '../../styles';

const mapStateToProps = ( {alert_data}) => ({
  show: alert_data.show,
  message: alert_data.message,
  footerText: alert_data.footerText,
  actionText: alert_data.actionText,
  onTap: alert_data.onTap,
  alertType: alert_data.alertType
});

class customAlertModal extends React.Component {
  constructor(props) {
    super(props);

  }

  onConfirm = () => {
    if (this.props.onTap) {
      this.props.onTap();
    }
    CustomAlert.hide()
  };

  setupComponents() {
    if (this.props.alertType === 'success') {
      this.image = successImage;

      setTimeout(() => {
        this.onConfirm();
      }, 3000);
    }

    else if (this.props.alertType === 'failure') {
      this.image = failureImage;
    }

    else if (this.props.alertType === 'retry') {
      this.image = failureImage;
    }
  }

  render() {

    this.setupComponents();

    return (

      <React.Fragment>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.props.show}
          coverScreen={false}
          hasBackdrop={false}
        >
          <View style={inlineStyles.backgroundStyle}>
            <Image
              style={[inlineStyles.loadingImage]}
              source={this.image}/>

            <Text style={inlineStyles.loadingMessage}>{this.props.message}</Text>

            <Text style={inlineStyles.footerText}>{this.props.footerText}</Text>

            <LinearGradient
              colors={['#ff7499', '#ff5566']}
              locations={[0, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ marginTop: 25, borderRadius: 3 , flexDirection: 'row' }}
            >
              <TouchableOpacity
                onPress={() => {
                  this.onConfirm();
                }}
                style={[Theme.Button.btn, { borderWidth: 0 , width:'80%'}]}
              >
                <Text
                  style={[
                    Theme.Button.btnPinkText,
                    { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                  ]}
                >
                  {this.props.actionText}
                </Text>
              </TouchableOpacity>
            </LinearGradient>

          </View>
        </Modal>
      </React.Fragment>
    );
  }
}

export const CustomAlertModal = connect(mapStateToProps)(customAlertModal);
export const CustomAlert = {
  showSuccess: (message = '', footerText = '') => {
    Store.dispatch(showAlert('success', message, footerText, null, null));
  },

  showFailure: (message= '', footerText ='', actionText= '', onTapCallback = null) => {
    Store.dispatch(showAlert('failure', message, footerText, actionText, onTapCallback));
  },

  showRetry: (message= '', footerText= '', actionText= '', onTapCallback = null) => {
    Store.dispatch(showAlert('retry', message, footerText, actionText, onTapCallback));
  },

  hide: () => {
    Store.dispatch(hideAlert());
  }
};
