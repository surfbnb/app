import React, { Component } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image, Dimensions } from 'react-native';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { OstWalletSdk, OstWalletSdkUI, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import DeviceInfo from 'react-native-device-info';

import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';
import loggedOutIcon from '../../assets/drawer-logout-icon.png';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import pepoAmountWallet from '../../assets/pepo-amount-wallet.png';
import Toast from '../../theme/components/NotificationToast';

import BackArrow from '../../assets/back-arrow.png';
import {connect} from "react-redux";
import OstWalletSdkHelper from "../../helpers/OstWalletSdkHelper";

class CustomDrawerContent extends Component {
  constructor(props) {
    super(props);
    this.userName = "";
    this.state = {
      disableButtons: false,
      showWalletSettings: false
    };
    this.twitterDisconnect = this.twitterDisconnect.bind(this);
    this.CurrentUserLogout = this.CurrentUserLogout.bind(this);
  }

  componentDidMount() {
    this.updateMenuSettings();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.updateMenuSettings();
  }

  updateMenuSettings = () => {
    this.updateUserName();
    this.updateWalletSettings();
  };

  updateUserName = () => {
    this.userName = reduxGetter.getName(CurrentUser.getUserId()) || "";
  };

  updateWalletSettings = () => {
    if (CurrentUser.getOstUserId()) {
      OstWalletSdk.getCurrentDeviceForUserId(CurrentUser.getOstUserId(), (localDevice) => {

        if (localDevice && OstWalletSdkHelper.canDeviceMakeApiCall( localDevice ) && CurrentUser.isUserActivated() ) {
          if ( !this.state.showWalletSettings ) {
            this.setState({
              showWalletSettings: true
            });
          }
        } else {
          if ( this.state.showWalletSettings ) {
            this.setState({
              showWalletSettings: false
            })
          }
        }
      });
    }
  };

  twitterDisconnect() {
    this.setState(
      {
        disableButtons: true
      },
      () => {
        new PepoApi('/auth/twitter-disconnect')
          .post()
          .catch((error) => {
            Toast.show({
              text: 'Twitter Disconnect failed',
              icon: 'error'
            });
            this.setState({ disableButtons: false });
          })
          .then(async (res) => {
            if (res && res.success) {
              this.CurrentUserLogout();
            } else {
              Toast.show({
                text: 'Twitter Disconnect failed',
                icon: 'error'
              });
              this.setState({ disableButtons: false });
            }
          });
      }
    );
  }

  CurrentUserLogout() {
    let params = {
      device_id: DeviceInfo.getUniqueID()
    };
    this.setState(
      {
        disableButtons: true
      },
      async () => {
        await CurrentUser.logout(params);
        setTimeout(() => {
          this.setState({
            disableButtons: false
          });
        }, 300);
      //TODO: Show error somewhere.
    });
  }

  initWallet = () => {
    //TODO: Navigation should push instead of navigate
    this.props.navigation.navigate("WalletSettingScreen") ;
  };

  renderWalletSetting = () => {
    if ( !this.state.showWalletSettings ) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.initWallet} >
        <View style={[styles.itemParent]}>
          <Image style={{ height: 24, width: 25.3 }} source={pepoAmountWallet} />
          <Text style={styles.item}>Wallet settings</Text>
        </View>
      </TouchableOpacity>);
  };

  render(){
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={[styles.container, {justifyContent: 'space-between'}]}>
        <View>
          <View style={styles.header}>
              <TouchableOpacity
                  onPress={this.props.navigation.closeDrawer}
                  style={{ height: 30, width: 30, alignItems: 'center', justifyContent: 'center' }}
              >
                <Image style={{ width: 10, height: 18 }} source={BackArrow} />
              </TouchableOpacity>
              <Text style={styles.headerText}>{this.userName}</Text>
            </View>
            <TouchableOpacity onPress={this.twitterDisconnect} disabled={this.state.disableButtons}>
              <View style={styles.itemParent}>
                <Image style={{ height: 24, width: 25.3 }} source={twitterDisconnectIcon} />
                <Text style={styles.item}>Twitter Disconnect</Text>
              </View>
            </TouchableOpacity>

            {this.renderWalletSetting()}

            <TouchableOpacity onPress={this.CurrentUserLogout} disabled={this.state.disableButtons}>
              <View style={styles.itemParent}>
                <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
                <Text style={styles.item}>Log out</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 12 }}>
            <Text style={{ fontSize: 12 }}>Pepo v{DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})</Text>
          </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = ({ current_user }) => ({ current_user });

export default connect(mapStateToProps)(CustomDrawerContent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderLeftWidth: 1,
    borderLeftColor: Colors.whisper
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
    fontFamily: 'AvenirNext-Regular'
  }
});
