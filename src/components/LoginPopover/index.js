import React from 'react';
import { connect } from 'react-redux';
import {View, Modal, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Platform} from 'react-native';
import firebase from 'react-native-firebase';
import DeviceInfo from 'react-native-device-info';

import TouchableButton from '../../theme/components/TouchableButton';
import inlineStyles from './styles';
import Theme from '../../theme/styles';
import Store from '../../store';
import { showLoginPopover, hideLoginPopover, showConnectingLoginPopover } from '../../actions';
import loggedOutLogo from '../../assets/logged-out-logo.png';
import cwTwitter from '../../assets/connect-with-twitter.png';
import cwApple from '../../assets/connect-with-apple.png';
import cwGmail from '../../assets/connect-with-gmail.png';
import cwGithub from '../../assets/connect-with-github.png';
import modalCross from '../../assets/modal-cross-icon.png';
import ReduxGetter from "../../services/ReduxGetters";
import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import { WEB_ROOT } from '../../constants/index';
import AppConfig from '../../constants/AppConfig';
import TwitterWebLoginActions from '../WebLogins/TwitterWebLogin';
import GoogleOAuth from '../../services/ExternalLogin/GoogleOAuth';
import GitHubWebLoginActions from '../WebLogins/GitHubWebLogin';
import AppleLoginActions  from '../AppleLogin';
import NavigationService from '../../services/NavigationService';
import LinearGradient from "react-native-linear-gradient";
import LastLoginedUser from "../../models/LastLoginedUser";
import profilePicture from "../../assets/default_user_icon.png";

const mapStateToProps = ({ login_popover }) => {
  return {
    show: login_popover.show,
    isTwitterConnecting: login_popover.isTwitterConnecting
  }
};

const serviceTypes = AppConfig.authServiceTypes;
const btnPostText = 'Connecting...';
const sequenceOfLoginServices = [serviceTypes.twitter,serviceTypes.apple, serviceTypes.google, serviceTypes.github ];
const versionIOS = DeviceInfo.getSystemVersion();
const finalVersionIOS = versionIOS <= 13;

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false,
      continueAs: 'Continue as',
      showAllOptions : !this.isLastLoginUser()
    };
    this.setLoginServicesConfig();
  }

  setLoginServicesConfig = () => {
    this.loginServicesConfig = {
      [serviceTypes.twitter]: {
        header: 'Continue with Twitter',
        pressHandler: this.twitterPressHandler,
        icon: cwTwitter,
        width: 21.14,
        height: 17.14
      },
      [serviceTypes.apple]: {
        header: 'Continue with Apple',
        pressHandler: this.applePressHandler,
        icon: cwApple,
        width: 17.3,
        height: 20
      },
      [serviceTypes.google]:{
        header: 'Continue with Gmail',
        pressHandler: this.gmailPressHandler,
        icon: cwGmail,
        width: 21,
        height: 21
      },
      [serviceTypes.github]: {
        header: 'Continue with Github',
        pressHandler: this.githubPressHandler,
        icon: cwGithub,
        width: 19,
        height: 18.5
      },
    };
  };

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

  gmailPressHandler = () => {
    GoogleOAuth.signIn();
  }

  githubPressHandler = () => {
    GitHubWebLoginActions.signIn();
  }

  twitterPressHandler = () => {
    this.setState({ disableLoginBtn: true });
    TwitterWebLoginActions.signIn();
  }

  applePressHandler = () => {
    AppleLoginActions.signIn();
  }

  //Use this function if needed to handle hardware back handling for android.
  closeModal = () => {
    if (!this.props.isTwitterConnecting) {
      NavigationService.goBack();
    }
    return true;
  };

  getConnectBtnText = () => {
    if ( this.props.isTwitterConnecting || this.state.disableLoginBtn) {
      return btnPostText;
    } 
    return btnPreText.twitter;
  }

  getLoginButtons = () => {
    let buttonsJSX = sequenceOfLoginServices.map((item)=>{
      if((item === 'apple' && Platform.OS === "android") || (item === 'apple' && finalVersionIOS)) return;
      let currentServiceConfig = this.loginServicesConfig[item];
      return <TouchableButton
        key={item}
        TouchableStyles={[
          inlineStyles.loginBtnStyles,
          this.state.disableLoginBtn ? Theme.Button.disabled : null
        ]}
        TextStyles={[Theme.Button.btnPinkText, inlineStyles.loginBtnTextStyles ]}
        text={currentServiceConfig.header}
        onPress={currentServiceConfig.pressHandler}
        source={currentServiceConfig.icon}
        imgDimension={{ width: currentServiceConfig.width, height: currentServiceConfig.height, marginRight: 8 }}
        disabled={this.state.disableLoginBtn}
      />
    });
    return buttonsJSX;
  };

  isLastLoginUser(){
    return LastLoginedUser.getLastLoginServiceType() && LastLoginedUser.getUserName();
  }

  termsOfService(){
    return <View style={inlineStyles.tocPp}>
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
  }

  closeAction(){
    return <TouchableOpacity
      onPress={this.closeModal}
      style={inlineStyles.crossTouchable}
    >
      <Image source={modalCross} style={inlineStyles.crossIconSkipFont} />
    </TouchableOpacity>
  }

  onMoreOptionClick = () => {
    this.setState({showAllOptions : true});
  }

  getProfileImageMarkup(){
    const profilePic = LastLoginedUser.getProfileImage();
    let src;
    if ( profilePic) {
      src = { uri: profilePic };
    } else {
      src = profilePicture;
    }
    return <Image style={{height: 80, width: 80, borderRadius: 40}} source={src} />
  }

  signInViaLastLoginService = () => {
    const serviceConfig = this.loginServicesConfig[LastLoginedUser.getLastLoginServiceType()];
    serviceConfig.pressHandler.apply(this);
  }

  render() {
    return (
      <TouchableWithoutFeedback onPressIn={this.closeModal}>
        <View style={inlineStyles.parent}>
          <TouchableWithoutFeedback>
            {!this.state.showAllOptions ? (
              <View style={[inlineStyles.container, inlineStyles.welcomeBack]}>
                {this.closeAction()}
                {this.getProfileImageMarkup()}
                <Text style={[inlineStyles.desc, { marginTop: 10, fontSize: 16, letterSpacing: 0.5, fontFamily: 'AvenirNext-DemiBold'}]}>
                  Welcome back
                </Text>
                <LinearGradient
                  colors={['#ff7499', '#ff5566']}
                  locations={[0, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 3, borderTopRadius: 0, width: '80%', marginTop: 15, marginBottom: 20 }}
                >
                  <TouchableOpacity
                    style={[Theme.Button.btn, { borderWidth: 0 }]}
                    disabled={this.state.isSubmitting}
                    onPress={this.signInViaLastLoginService}
                  >
                    <Text style={[Theme.Button.btnPinkText, { textAlign: 'center', fontSize: 16 }]}>{this.state.continueAs} {LastLoginedUser.getUserName()} </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity onPress={this.onMoreOptionClick}>
                  <Text style={[{ textAlign: 'center', fontSize: 16, letterSpacing: 0.5, marginBottom: 10 }]}>More Options</Text>
                </TouchableOpacity>
                {this.termsOfService()}
              </View>
            ) : (
              <View style={inlineStyles.container}>
                {this.closeAction()}
                <Image source={loggedOutLogo} style={{ width: 261, height: 70, marginBottom: 20 }} />
                <Text style={[inlineStyles.desc, {fontWeight: '500'}]}>
                  Pepo is a place to discover & support creators.
                </Text>
                <Text style={[inlineStyles.desc, {marginBottom: 6, fontSize: 14}]}>
                  Please create an account to continue.
                </Text>
                {this.getLoginButtons()}
                {this.termsOfService()}
              </View>
              )}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
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
    NavigationService.navigate("LoginPopover");
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
    NavigationService.goBack();
  }
};
