import React from 'react';
import { connect } from 'react-redux';
import {View, Modal, Text, Image, Animated, Easing, Platform, TouchableOpacity, TouchableWithoutFeedback} from 'react-native';
import * as Progress from 'react-native-progress';

import inlineStyles from './styles';
import pepoTxIcon from "../../../assets/pepo-white-icon.png";
import Colors from '../../styles/Colors';
import Store from '../../../store';
import {showModalCover, hideModalCover} from '../../../actions';
import Theme from "../../styles";
import LinearGradient from 'react-native-linear-gradient';
import failureImage from "../../../assets/toast_error.png";
import successImage from '../../../assets/toast_success.png'

const mapStateToProps = ({ modal_cover }) => ({
  show: modal_cover.show,
  message: modal_cover.message,
  footerText: modal_cover.footerText,
  alertData: modal_cover.alertData
});

class loadingModalCover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rotate: new Animated.Value(0),
      scale: new Animated.Value(0.1)
    };
  }

  getAnimation(){
    return Animated.sequence([
      Animated.delay(800),
      Animated.timing(this.state.rotate, {
        toValue: 1,
        easing:Easing.elastic(1.5),
        useNativeDriver: true
      }),
      Animated.loop(
        Animated.timing(this.state.scale, {
          duration: 1200,
          easing:Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      )
    ])
  };

  onButtonTap = () => {
    let alertData =  this.props.alertData;
    if (alertData && alertData.onTap) {
      if (typeof alertData.onTap === "function") {
        alertData.onTap(true);
      }
    }
    LoadingModal.hide()
  };

  onViewTap = () => {
    let alertData =  this.props.alertData;
    if (alertData && alertData.onTap) {
      if (typeof alertData.onTap  === "function") {
        alertData.onTap(false);
      }
    }
    LoadingModal.hide()
  };

  render() {
    return (
      <React.Fragment>
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={false}
          >
            {this.getModalView()}

          </Modal>
      </React.Fragment>
    );
  }

  getModalView() {
    //check for alert
    if (this.props.alertData) {

      //return alert UI
      return this.getAlertView()
    }

    return this.getProgressView()
  }

  getAlertView() {
    let alertData = this.props.alertData
      , image = ''
    ;

    if (alertData.alertType === 'success') {
      image = successImage;

      setTimeout(() => {
        this.onViewTap();
      }, 3000);
    }

    else if (alertData.alertType === 'failure') {
      image = failureImage;
    }

    else if (alertData.alertType === 'retry') {
      image = failureImage;
    }

    return(
      <TouchableWithoutFeedback
        onPressOut={this.onViewTap}
      >
        <View style={inlineStyles.backgroundStyle}>
          <Image
            style={[inlineStyles.alertImage]}
            source={image}/>

          <Text style={inlineStyles.alertMessage}>{alertData.message}</Text>

          <Text style={inlineStyles.alertFooter}>{alertData.footerText}</Text>

          {this.getActionButtonView()}
        </View>
      </TouchableWithoutFeedback>
    )
  }

  getProgressView() {

    if (!this.props.message || this.props.message.length == 0) {
      return <View style={inlineStyles.backgroundStyle} />
    }

    const rotateData = this.state.rotate.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg','-135deg'],
    });
    const scaleData = this.state.scale.interpolate({
      inputRange: [0.11, 0.5, 1],
      outputRange: [1, Platform.OS == 'ios' ? 1.15 : 1.3, 1]
    });
    let animationStyle = {
      transform: [
        {scale: scaleData},
        {rotate: rotateData}
      ],
    };

    this.props.show ? this.getAnimation().start() : this.getAnimation().stop();

    //progress indicator view
    return (
      <View style={inlineStyles.backgroundStyle}>
        <Animated.Image
          style={[ animationStyle, {width: 40, height: 40, marginBottom: 30} ]}
          source={pepoTxIcon}/>
        <Text style={inlineStyles.loadingMessage}>{this.props.message}</Text>
        <Progress.Bar
          indeterminate={true}
          indeterminateAnimationDuration={500}
          width={200}
          unfilledColor={Colors.white}
          color={Colors.primary}
          borderWidth={0}
        />
        <Text style={inlineStyles.footerText}>{this.props.footerText}</Text>
      </View>
    )
  }

  getActionButtonView() {

    let alertData = this.props.alertData;

    let topMarginForButton = 0;
    if (alertData.footerText && alertData.footerText.length > 0) {
      topMarginForButton = 15
    }

    if (alertData.actionText && alertData.actionText.length > 0) {
      return (
        <LinearGradient
          colors={['#ff7499', '#ff5566']}
          locations={[0, 1]}
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          style={{marginTop: topMarginForButton, borderRadius: 3, flexDirection: 'row',}}
        >
          <TouchableOpacity
            onPress={() => {
              this.onButtonTap();
            }}
            style={[Theme.Button.btn, {borderWidth: 0, width: '80%'}]}
          >
            <Text
              style={[
                Theme.Button.btnPinkText,
                {fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center'}
              ]}
            >
              {alertData.actionText}
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      )
    }
  }
}

export const LoadingModalCover = connect(mapStateToProps)(loadingModalCover);
export const LoadingModal = {
  show: (message, footerText) => {
    Store.dispatch(showModalCover(message, footerText));
  },

  showSuccessAlert: (message = '', footerText = '') => {
    let alertData = {alertType: 'success', message: message, footerText: footerText, actionText: null, onTap: null};
    setTimeout(() => {
      Store.dispatch(showModalCover(null, null, alertData));
    }, 0)

  },

  showFailureAlert: (message= '', footerText ='', actionText= 'Cancel', onTapCallback = null) => {
    let alertData = {alertType: 'failure', message: message, footerText: footerText, actionText: actionText, onTap: onTapCallback};
    setTimeout(() => {
      Store.dispatch(showModalCover(null, null, alertData));
    },0)
  },

  showRetryAlert: (message= '', footerText= '', actionText= '', onTapCallback = null) => {
    let alertData = {alertType: 'retry', message: message, footerText: footerText, actionText: actionText, onTap: onTapCallback};
    setTimeout(() => {
      Store.dispatch(showModalCover(null, null, alertData));
    },0);
  },

  hide: () => {
    Store.dispatch(hideModalCover());
  }
};
