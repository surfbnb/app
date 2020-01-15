import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import firebase from 'react-native-firebase';

import TouchableButton from '../../theme/components/TouchableButton';
import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover, showConnectingLoginPopover } from '../../actions';
import loggedOutLogo from '../../assets/logged-out-logo.png';
import twitterBird from '../../assets/twitter-bird.png';
import modalCross from '../../assets/modal-cross-icon.png';
import ReduxGetter from "../../services/ReduxGetters";
import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import { WEB_ROOT } from '../../constants/index';
import AppConfig from '../../constants/AppConfig';
import { TwitterWebLoginActions } from '../TwitterWebLogin';

let TwitterAuthService;
import('../../services/TwitterAuthService').then((imports) => {
  TwitterAuthService = imports.default;
});

const mapStateToProps = ({ login_popover }) => {
  return {
    show: login_popover.show,
    isTwitterConnecting: login_popover.isTwitterConnecting
  }
};

const btnPreText = 'Connect with Twitter';
const btnPostText = 'Connecting...';

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false
    };
  }

  componentWillUnmount() {
    this.state.disableLoginBtn = false;
    
  }

  componentDidUpdate(prevProps) {
    if ( this.props.isTwitterConnecting && this.props.isTwitterConnecting !== prevProps.isTwitterConnecting ) {
      this.setState({ disableLoginBtn: true });
    } else if (this.props.show && this.props.show !== prevProps.show) {
      this.setState({ disableLoginBtn: false });
    }
  }

  onSignUp = () => {
    this.setState({ disableLoginBtn: true });
    //TwitterAuthService.signUp();
    TwitterWebLoginActions.signIn();
  };

  //Use this function if needed to handle hardware back handling for android.
  closeModal = () => {
    if (!this.props.isTwitterConnecting) {
      Store.dispatch(hideLoginPopover());
    }
    return true;
  };

  getConnectBtnText = () => {
    if ( this.props.isTwitterConnecting || this.state.disableLoginBtn) {
      return btnPostText;
    } 
    return btnPreText;
  }

  render() {
    return (
      <React.Fragment>
        {this.props.show && (
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={true}
          >
            <TouchableWithoutFeedback onPressIn={this.closeModal}>
              <View style={inlineStyles.parent}>
                <TouchableWithoutFeedback>
                  <View style={inlineStyles.container}>
                    <TouchableOpacity
                      onPress={this.closeModal}
                      style={{
                        position: 'absolute',
                        top: 15,
                        right: 15,
                        width: 38,
                        height: 38,
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Image source={modalCross} style={{ width: 19.5, height: 19 }} />
                    </TouchableOpacity>
                    <Image source={loggedOutLogo} style={{ width: 261, height: 70, marginBottom: 20 }} />
                    <Text
                      style={[
                        inlineStyles.desc,
                        {
                          fontWeight: '500'
                        }
                      ]}
                    >
                      Meet the people shaping the
                    </Text>
                    <Text
                      style={[
                        inlineStyles.desc,
                        {
                          fontWeight: '500',
                          marginBottom: 15
                        }
                      ]}
                    >
                       crypto movement.
                    </Text>
                    <TouchableButton
                      TouchableStyles={[
                        Theme.Button.btnSoftBlue,
                        {
                          marginTop: 15,
                          flexDirection: 'row',
                          height: 55,
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '85%',
                          marginBottom: 10
                        },
                        this.state.disableLoginBtn ? Theme.Button.disabled : null
                      ]}
                      TextStyles={[Theme.Button.btnPinkText, { fontSize: 18 }]}
                      text={this.getConnectBtnText()}
                      onPress={this.onSignUp}
                      source={twitterBird}
                      imgDimension={{ width: 28, height: 22.5, marginRight: 8 }}
                      disabled={this.state.disableLoginBtn}
                    />
                    <View style={inlineStyles.tocPp}>
                      <Text style={{textAlign: 'center'}}>
                        <Text style={inlineStyles.termsTextBlack}>By signing up you confirm that you agree to our </Text>
                        <Text style={inlineStyles.termsTextBlue} onPress={multipleClickHandler(() => {
                          this.closeModal();
                          InAppBrowser.openBrowser(
                            `${WEB_ROOT}/terms`
                          );
                        })}>Terms of use </Text>
                        <Text style={inlineStyles.termsTextBlack}>and </Text>
                        <Text style={inlineStyles.termsTextBlue} onPress={multipleClickHandler(() => {
                          this.closeModal();
                          InAppBrowser.openBrowser(
                              `${WEB_ROOT}/privacy`
                          );
                        })}>Privacy Policy</Text>
                      </Text>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
      </React.Fragment>
    );
  }
}

export const LoginPopover = connect(mapStateToProps)(loginPopover);
export const LoginPopoverActions = {
  _track: () => {
    let analyticsAction = AppConfig.routesAnalyticsMap.TwitterLogin;
    firebase.analytics().setCurrentScreen(analyticsAction, analyticsAction);    
  },
  show: () => {
    Store.dispatch(showLoginPopover());
    LoginPopoverActions._track();
  },
  showConnecting: () => {
    let loginPopoverProps = ReduxGetter.getLoginPopOverProps();
    if ( !loginPopoverProps || !loginPopoverProps.show ) {
      //Track.
      LoginPopoverActions._track();
    }
    Store.dispatch(showConnectingLoginPopover());
  },
  hide: () => {
    Store.dispatch(hideLoginPopover());
  }
};
