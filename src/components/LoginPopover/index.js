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
import TwitterWebLoginActions from '../TwitterWebLogin';
import GmailOAuth from '../../services/ExternalLogin/GmailOAuth';
import GitHubWebLoginActions from '../GitHubWebLogin';
import AppleLoginActions  from '../AppleLogin';
import NavigationService from '../../services/NavigationService';

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


const btnPostText = 'Connecting...';
const sequenceOfLoginServices = ['twitter','apple', 'gmail', 'github' ];
const versionIOS = DeviceInfo.getSystemVersion();
const finalVersionIOS = versionIOS <= 13;

class loginPopover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disableLoginBtn: false
    };
    this.setLoginServicesConfig();
  }

  setLoginServicesConfig = () => {
    this.loginServicesConfig = {
      twitter: {
        header: 'Continue with Twitter',
        pressHandler: this.twitterPressHandler,
        icon: cwTwitter,
        width: 21.14,
        height: 17.14
      },
      apple: {
        header: 'Continue with Apple',
        pressHandler: this.applePressHandler,
        icon: cwApple,
        width: 17.3,
        height: 20
      },
      gmail:{
        header: 'Continue with Gmail',
        pressHandler: this.gmailPressHandler,
        icon: cwGmail,
        width: 21,
        height: 21
      },
      github: {
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

  gmailPressHandler = async() => {
    let response = await GmailOAuth.signIn();
    if(response && response.success){
      console.log("logged in with gmail", response);
    } else {

    }
  }

  githubPressHandler = async() => {
    LoginPopoverActions.hide();
    let response = await GitHubWebLoginActions.signIn();
    if(response && response.success){
      console.log("logged in with github", response);
    } else {

    }
  }

  twitterPressHandler = () => {
    this.setState({ disableLoginBtn: true });
    //TwitterAuthService.signUp();
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
    return true;
  }

  isError() {
    return false;
  }

  getLastLoginUserName(){

  }

  getLastLoginProfilePic(){

  }

  onMoreOptionClick = () => {

  }
  

  render() {
    return (
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
              <Text style={[inlineStyles.desc, {fontWeight: '500'}]}>
                Pepo is a place to discover & support creators.
              </Text>
              <Text style={[inlineStyles.desc, {marginBottom: 6, fontSize: 14}]}>
                Please create an account to continue.
              </Text>
              {this.getLoginButtons()}
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
