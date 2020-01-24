import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image, ScrollView, SafeAreaView } from 'react-native';
import { OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import DeviceInfo from 'react-native-device-info';
import { connect } from 'react-redux';

import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';
import twitterDisconnectIcon from '../../assets/settings-twitter-disconnect.png';
import referAndEarn from '../../assets/settings-refer-and-earn.png';
import pepoAmountWallet from '../../assets/settings-wallet-settings.png';
import helpIcon from  '../../assets/settings-support.png';
import about from '../../assets/settings-about.png';
import privacy from '../../assets/settings-privacy.png';
import tac from '../../assets/settings-terms-and-conditions.png';
import storePink from '../../assets/StorePink.png';
import Toast from '../../theme/components/NotificationToast';
import multipleClickHandler from '../../services/MultipleClickHandler';
import OstWalletSdkHelper from '../../helpers/OstWalletSdkHelper';
import InAppBrowser from '../../services/InAppBrowser';
import {DrawerEmitter} from '../../helpers/Emitters';
import {WEB_ROOT, VIEW_END_POINT, TOKEN_ID} from "../../constants";
import Pricer from '../../services/Pricer';
import Utilities from '../../services/Utilities';
import ReduxGetters from '../../services/ReduxGetters';
import DataContract from '../../constants/DataContract';
import LastLoginedUser from "../../models/LastLoginedUser";
import authService from "../../services/AuthServicesFactory";
import AuthBaseService from "../../services/AuthServices/Base";
import AppConfig from "../../constants/AppConfig";

const serviceTypes = AppConfig.authServiceTypes;
const disconnetImageIconStyle = {
  [serviceTypes.twitter] : {
    width: 21.14,
    height: 17.14
  },
  [serviceTypes.google] : {
    width: 21,
    height: 21
  },
  [serviceTypes.apple] : {
    width: 17.3,
    height: 20
  },
  [serviceTypes.github] : {
    width: 19,
    height: 18.5
  }
}


class CustomDrawerContent extends Component {
  constructor(props) {
    super(props);
    this.userName = '';
    this.token = null;
    this.state = {
      disableButtons: false,
      showWalletSettings: false,
      pepocorns: ReduxGetters.getPepocornBalance()
    };
  }

  componentDidMount() {
    this._fetchToken();
    //this.fetchPepocorns();
    this.updateMenuSettings();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateMenuSettings();
  }

  componentWillUnmount(){
    this.onPepoCornFetchSuccess = () => {};
  }

  fetchPepocorns(){
    Pricer.fetchPepocornsBalance()
    .then((res)=> {
      this.onPepocornFetchSuccess(res);
    })
    .catch((error)=>{});
  }

  onPepocornFetchSuccess(res){
    this.setState({pepocorns: ReduxGetters.getPepocornBalance()})
  }

  updateMenuSettings = () => {
    this.updateUserName();
    this.updateWalletSettings();
  };

  updateUserName = () => {
    this.userName = reduxGetter.getName(CurrentUser.getUserId()) || '';
  };

  updateWalletSettings = () => {
    if (CurrentUser.getOstUserId()) {
      OstWalletSdk.getCurrentDeviceForUserId(CurrentUser.getOstUserId(), (localDevice) => {
        if (localDevice && OstWalletSdkHelper.canDeviceMakeApiCall(localDevice) && CurrentUser.isUserActivated()) {
          if (!this.state.showWalletSettings) {
            this.setState({
              showWalletSettings: true
            });
          }
        } else {
          if (this.state.showWalletSettings) {
            this.setState({
              showWalletSettings: false
            });
          }
        }
      });
    }
  };

  disconnect = () => {
    const serviceType = LastLoginedUser.getLastLoginServiceType() ,
      oAuthService = authService(serviceType) ;
    if(oAuthService instanceof  AuthBaseService ){
      oAuthService.logout();
    }else {
      //Current user logout incase if we dont get an service. Should'nt be here
      console.warn("Logout oAuth service was not found");
      CurrentUser.logout();
    }
  };

  getDisconnectBtnImage = () => {
    const serviceType = LastLoginedUser.getLastLoginServiceType();
    const styleConfig =  disconnetImageIconStyle[serviceType];
    if( serviceType ){
      return <Image style={[ styleConfig , {resizeMode: 'contain' }]} source={LastLoginedUser.getOAuthIcon(serviceType)} />;
    }else {
      return null;
    }
  }

  getDisconnectBtnText = () => {
    const serviceType = LastLoginedUser.getLastLoginServiceType();
    if(serviceType){
      return `Disconnect ${Utilities.capitalizeFirstLetter(serviceType)}`;
    }else {
      console.warn("Logout oAuth service was not found");
      return "Logout"
    }
  };

  initWallet = () => {
    this.props.navigation.navigate('WalletSettingScreen');
  };

  referAndEarn = () => {
    this.props.navigation.push('ReferAndEarn');
  };

  onGetSupport = () => {
    // 1. Disable the button.
    this.setState({ disableButtons: true }, () => {
      //2. Make Api call.
      new PepoApi(DataContract.support.infoApi)
        .get()
        .then((response) => {
          if ( !response || !response.success || !response.data || !response.data.result_type ) {
            // Throw the response to display error.
            throw res;
          }
          let result_type = response.data.result_type;
          let payload = response.data[ result_type ];
          if ( !payload || !payload.url ) {
            throw new Error("Unexpected server response");
          }

          // 3.t Enable the button.
          this.setState({ disableButtons: false }, () => {
            //4. Open the web-view
            InAppBrowser.openBrowser( payload.url );
          });
        })
        .catch((response) => {
          // 3.f Enable the button.
          this.setState({ disableButtons: false })
        });
      });
  }
  _getUtilityBandedToken() {
    return (this.token.auxiliary_chains[0]).utility_branded_token || '0x'
  }

  _fetchToken() {
    OstWalletSdk.getToken(TOKEN_ID, (token) => {
      this.token = token;
    })
  }

  _getAuxChainId() {
    return ((this.token.auxiliary_chains[0]).chain_id).toString(10) || '0'
  }

  aboutLink = () =>{
    InAppBrowser.openBrowser( `${WEB_ROOT}/about` );
  }

  blockExplorer = () =>{
    let link = `${VIEW_END_POINT}token/ec-${this._getAuxChainId()}-${this._getUtilityBandedToken()}`
    InAppBrowser.openBrowser( link );
  }

  termsAndConditions = () =>{
    InAppBrowser.openBrowser(
      `${WEB_ROOT}/terms`
    );
  }

  privacypolicy = ()=>{
    InAppBrowser.openBrowser(
      `${WEB_ROOT}/privacy`
    );
  }

  onPepocornsClick = () => {
    Utilities.openRedemptionWebView();
  }

  render() {
    return (
      <SafeAreaView style={[styles.container, {paddingVertical: 0}]}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'space-between'
          }}
        >

        <View style={{paddingBottom: 80}}>

            <TouchableOpacity
                onPress={multipleClickHandler(() => {
                  this.onPepocornsClick();
                })}
                disabled={this.state.disableButtons}>
                <View style={styles.itemParent}>
                  <Image style={{ height: 27, width: 27, resizeMode: 'contain' }} source={storePink} />
                  <Text style={styles.item}>Pepo.com Store</Text>
                </View>
            </TouchableOpacity>

          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              this.referAndEarn();
            })}
            disabled={this.state.disableButtons}
          >
            <View style={styles.itemParent}>
              <Image style={{ height: 29, width: 26.6, resizeMode: 'contain' }} source={referAndEarn} />
              <Text style={styles.item}>Invite</Text>
            </View>
          </TouchableOpacity>
          {this.renderWalletSetting()}

          <TouchableOpacity onPress={multipleClickHandler(() => {
            this.onGetSupport();
          })} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 29, width: 29, resizeMode: 'contain' }} source={helpIcon} />
              <Text style={styles.item}>Support & Feedback</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={multipleClickHandler(() => {
            this.privacypolicy();
          })} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 27.75, width: 25.5, resizeMode: 'contain' }} source={privacy} />
              <Text style={styles.item}>Privacy Policy</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={multipleClickHandler(() => {
            this.termsAndConditions();
          })} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 25.5, resizeMode: 'contain' }} source={tac} />
              <Text style={styles.item}>Terms and Conditions</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              this.aboutLink();
            })}
            disabled={this.state.disableButtons}
          >
            <View style={styles.itemParent}>
              <Image style={{ height: 27, width: 27, resizeMode: 'contain' }} source={about} />
              <Text style={styles.item}>About</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={multipleClickHandler(() => {
            this.disconnect();
          })} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              {this.getDisconnectBtnImage()}
              <Text style={styles.item}>{this.getDisconnectBtnText()}</Text>
            </View>
          </TouchableOpacity>

        </View>

        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Text style={{ fontSize: 12 }}>
            Pepo v{DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
          </Text>
        </View>
        </ScrollView>

      </SafeAreaView>
    );
  }

  renderWalletSetting = () => {
    if (!this.state.showWalletSettings) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.initWallet}>
        <View style={[styles.itemParent]}>
          <Image style={{ height: 26.6, width: 29, resizeMode: 'contain'  }} source={pepoAmountWallet} />
          <Text style={styles.item}>Wallet Settings</Text>
        </View>
      </TouchableOpacity>
    );
  };
}

const mapStateToProps = ({ current_user }) => ({ current_user });

export default connect(mapStateToProps)(CustomDrawerContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.whisper,
    backgroundColor: Colors.white,
    paddingTop: 10
  },
  header: {
    paddingVertical: 7,
    borderBottomColor: Colors.whisper,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 5,
    justifyContent: 'center'
  },
  headerText: {
    fontWeight: '600',
    fontSize: 17,
    flex: 1,
    textAlign: 'center'
  },
  itemParent: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: Colors.whisper,
    borderBottomWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 15
  },
  item: {
    fontSize: 16,
    marginLeft: 10,
    marginTop: 3,
    fontFamily: 'AvenirNext-Regular'
  }
});
