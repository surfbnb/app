import React from 'react';
import {View, Text, Image, TouchableOpacity, TouchableWithoutFeedback, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

import TouchableButton from '../../theme/components/TouchableButton';
import inlineStyles from './styles';
import Theme from '../../theme/styles';
import loggedOutLogo from '../../assets/logged-out-logo.png';
import modalCross from '../../assets/modal-cross-icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';
import InAppBrowser from '../../services/InAppBrowser';
import { WEB_ROOT } from '../../constants/index';
import AppConfig from '../../constants/AppConfig';
import GoogleOAuth from '../../services/ExternalLogin/GoogleOAuth';
import AppleOAuth  from '../../services/ExternalLogin/AppleOAuth';
import NavigationService from '../../services/NavigationService';
import LinearGradient from "react-native-linear-gradient";
import LastLoginedUser from "../../models/LastLoginedUser";
import profilePicture from "../../assets/default_user_icon.png";
import WebLogins from '../../services/WebLogins';
import { analyticsSetCurrentScreen } from '../../helpers/helpers';
import {globalEvents,  globalEventsMap} from "../../helpers/GlobalEvents";

import {testProps} from "../../constants/AppiumAutomation";

const serviceTypes = AppConfig.authServiceTypes;
const btnPostText = 'Connecting...';
const versionIOS = DeviceInfo.getSystemVersion();
const finalVersionIOS = parseFloat( versionIOS ) <= 13;

let sequenceOfLoginServices = [serviceTypes.twitter, serviceTypes.google ] ; // Initially also had: serviceTypes.github
if( Platform.OS == 'ios' && !finalVersionIOS ){
  sequenceOfLoginServices.splice(1, 0, serviceTypes.apple);
}


class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false,
      showAllOptions : !this.isLastLoginUser(),
      currentConnecting: ''
    };
    this.resetBtnTimeOut = 0;
    this.setLoginServicesConfig();
  }

  componentDidMount(){
    globalEvents.on(globalEventsMap.oAuthCancel, this.onCancleAndError );
    globalEvents.on(globalEventsMap.oAuthError, this.onCancleAndError );
  }

  componentWillUnmount(){
    globalEvents.removeListener(globalEventsMap.oAuthCancel, this.onCancleAndError , this);
    globalEvents.removeListener(globalEventsMap.oAuthError, this.onCancleAndError , this );
  }

  onCancleAndError = () => {
    clearTimeout( this.resetBtnTimeOut );
    this.resetBtnTimeOut  = setTimeout(()=> {
      this.setState({disableLoginBtn : false, currentConnecting: ""});
    } , 100)
  };

  setLoginServicesConfig = () => {
    this.loginServicesConfig = {
      [serviceTypes.twitter]: {
        header: 'Continue with Twitter',
        pressHandler: this.twitterPressHandler,
        icon: LastLoginedUser.getOAuthIcon(serviceTypes.twitter),
        width: 21.14,
        height: 17.14,
        connectingHeader:btnPostText,
        testIdName: 'continue-with-twitter'
      },
      [serviceTypes.apple]: {
        header: 'Continue with Apple',
        pressHandler: this.applePressHandler,
        icon: LastLoginedUser.getOAuthIcon(serviceTypes.apple),
        width: 17.3,
        height: 20,
        connectingHeader: btnPostText,
        testIdName: 'continue-with-apple'
      },
      [serviceTypes.google]:{
        header: 'Continue with Gmail',
        pressHandler: this.gmailPressHandler,
        icon: LastLoginedUser.getOAuthIcon(serviceTypes.google),
        width: 21,
        height: 21,
        connectingHeader: btnPostText,
        testIdName: 'continue-with-google'
      },
      // [serviceTypes.github]: {
      //   header: 'Continue with GitHub',
      //   pressHandler: this.githubPressHandler,
      //   icon: LastLoginedUser.getOAuthIcon(serviceTypes.github),
      //   width: 19,
      //   height: 18.5,
      //   connectingHeader: btnPostText,
      //   testIdName: 'continue-with-github'
      // },
    };
  };


  beforeOAuthInvoke = (service ) => {
    analyticsSetCurrentScreen( service );
    this.setState({disableLoginBtn : true , currentConnecting:  AppConfig.authServiceTypes[service] })
  };

  gmailPressHandler = () => {
    this.beforeOAuthInvoke(AppConfig.authServiceTypes.google);
    GoogleOAuth.signIn();
  };

  githubPressHandler = () => {
    this.beforeOAuthInvoke(AppConfig.authServiceTypes.github);
    WebLogins.openGitHubWebLogin();
  };

  twitterPressHandler = () => {
    this.beforeOAuthInvoke(AppConfig.authServiceTypes.twitter);
    WebLogins.openTwitterWebLogin();
  };

  applePressHandler = () => {
    this.beforeOAuthInvoke(AppConfig.authServiceTypes.apple);
    AppleOAuth.signIn();
  };

  //Use this function if needed to handle hardware back handling for android.
  closeModal = () => {
    NavigationService.goBack();
    return true;
  };

  getLoginButtons = () => {
    let buttonsJSX = sequenceOfLoginServices.map((item)=>{
      let currentServiceConfig = this.loginServicesConfig[item];
      return <TouchableButton
        key={item}
        TouchableStyles={[
          inlineStyles.loginBtnStyles,
          this.state.disableLoginBtn ? Theme.Button.disabled : null
        ]}
        TextStyles={[Theme.Button.btnPinkText, inlineStyles.loginBtnTextStyles ]}
        text={this.state.currentConnecting === item ? currentServiceConfig.connectingHeader :  currentServiceConfig.header}
        onPress={currentServiceConfig.pressHandler}
        source={currentServiceConfig.icon}
        imgDimension={{ width: currentServiceConfig.width, height: currentServiceConfig.height, marginRight: 8 }}
        disabled={this.state.disableLoginBtn}
        {...testProps(currentServiceConfig.testIdName)}
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
          !this.state.disableLoginBtn && InAppBrowser.openBrowser(
            `${WEB_ROOT}/terms`
          );
        })}>Terms of use </Text>
        <Text style={inlineStyles.termsTextBlack}>and </Text>
        <Text style={inlineStyles.termsTextBlue} onPress={multipleClickHandler(() => {
          !this.state.disableLoginBtn && InAppBrowser.openBrowser(
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
      {...testProps('login-popover-cross-icon')}
    >
      <Image source={modalCross} style={inlineStyles.crossIconSkipFont} />
    </TouchableOpacity>
  }

  onMoreOptionClick = () => {
    this.setState({showAllOptions : true});
  };

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
    if(serviceConfig && serviceConfig.pressHandler){
      serviceConfig.pressHandler.apply(this);
      return;
    }

    /**
     * This should never happen. But just incase if it dose user can still login.
     * The app wont be blocking for it.
     */
    console.warn("AS services / pressHandler was unavaialable in serviceConfig LoginPopover.");
    this.setState({showAllOptions: true});
  };

  render() {
    return (
      <TouchableWithoutFeedback onPressIn={this.closeModal}>
        <View style={inlineStyles.parent}>
          <TouchableWithoutFeedback>
            {!this.state.showAllOptions ? (
              <View style={[inlineStyles.container, inlineStyles.welcomeBack]}>
                {this.closeAction()}
                {this.getProfileImageMarkup()}
                <Text style={[inlineStyles.desc, { marginTop: 10, fontSize: 16, fontFamily: 'AvenirNext-Medium'}]}>
                  Welcome back
                </Text>
                <LinearGradient
                  colors={['#ff7499', '#ff5566']}
                  locations={[0, 1]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{ borderRadius: 3, borderTopRadius: 0, width: '80%', marginTop: 20, marginBottom: 15 }}
                >
                  <TouchableOpacity
                    style={[Theme.Button.btn, { borderWidth: 0 }, this.state.disableLoginBtn ? Theme.Button.disabled : null]}
                    disabled={this.state.disableLoginBtn}
                    onPress={this.signInViaLastLoginService}
                    {...testProps('continue-as')}
                  >
                    <Text style={[Theme.Button.btnPinkText, { textAlign: 'center', fontSize: 16 }]} numberOfLines={1} ellipsizeMode={'tail'}>Continue as {LastLoginedUser.getUserName()} </Text>
                  </TouchableOpacity>
                </LinearGradient>
                <TouchableOpacity onPress={this.onMoreOptionClick} {...testProps('more-options')}>
                  <Text style={[{ textAlign: 'center', color: '#ff5566', fontFamily: 'AvenirNext-Medium'}]}>More Options</Text>
                </TouchableOpacity>
                {this.termsOfService()}
              </View>
            ) : (
              <View style={inlineStyles.container}>
                {this.closeAction()}
                <Image source={loggedOutLogo} style={{ width: 261, height: 70, marginBottom: 14 }} />
                <Text style={[inlineStyles.desc, {fontWeight: '500', marginBottom: 2}]}>
                  Meet the people shaping the crypto community movement
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

export const LoginPopover = loginPopover;
export const LoginPopoverActions = {
  show: () => {
    NavigationService.navigate("LoginPopover");
  },
  hide: () => {
    NavigationService.goBack(null);
  }
};
