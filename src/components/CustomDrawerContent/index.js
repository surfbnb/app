import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { OstWalletSdk} from '@ostdotcom/ost-wallet-sdk-react-native';
import DeviceInfo from 'react-native-device-info';

import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';
import loggedOutIcon from '../../assets/drawer-logout-icon.png';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import referAndEarn from '../../assets/refer-and-earn.png';
import pepoAmountWallet from '../../assets/pepo-amount-wallet.png';
import helpIcon from  '../../assets/help.png'
import Toast from '../../theme/components/NotificationToast';
import multipleClickHandler from '../../services/MultipleClickHandler';

import BackArrow from '../../assets/back-arrow.png';
import { connect } from 'react-redux';
import OstWalletSdkHelper from '../../helpers/OstWalletSdkHelper';
import {ostErrors} from "../../services/OstErrors";
import InAppBrowser from '../../services/InAppBrowser';

class CustomDrawerContent extends Component {
  constructor(props) {
    super(props);
    this.userName = '';
    this.state = {
      disableButtons: false,
      showWalletSettings: false
    };
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

  twitterDisconnect = () => {
    this.setState(
      {
        disableButtons: true
      },
      () => {
        new PepoApi('/auth/twitter-disconnect')
          .post()
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
          })
          .catch((error) => {
            Toast.show({
              text: 'Twitter Disconnect failed',
              icon: 'error'
            });
            this.setState({ disableButtons: false });
          });
      }
    );
  };

  CurrentUserLogout = () => {
    //this.props.navigation.closeDrawer();
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
      }
    );
  };

  initWallet = () => {
    //TODO: Navigation should push instead of navigate
    this.props.navigation.navigate('WalletSettingScreen');
  };

  referAndEarn = () => {
    this.props.navigation.push('ReferAndEarn');
  };

  onGetSupport = () => {
    // 1. Disable the button.
    this.setState({ disableButtons: true }, () => {
      //2. Make Api call.
      new PepoApi('/support/info')
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
          this.setState({ disableButtons: false }, () => {
            //4. Show error message.
            let errorMessage = ostErrors.getErrorMessage(response);
            LoadingModal.showFailureAlert(errorMessage, null, "Dismiss");
          });
        });
      });
  }

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'always' }} style={[styles.container, { justifyContent: 'space-between' }]}>
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
          <TouchableOpacity
            onPress={multipleClickHandler(() => {
              this.referAndEarn();
            })}
            disabled={this.state.disableButtons}
          >
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 29, resizeMode: 'contain' }} source={referAndEarn} />
              <Text style={styles.item}>Refer and Earn</Text>
            </View>
          </TouchableOpacity>
          {this.renderWalletSetting()}

          <TouchableOpacity   onPress={multipleClickHandler(() => {
              this.onGetSupport();
            })} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 25.3, resizeMode: 'contain' }} source={helpIcon} />
              <Text style={styles.item}>Support</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity   onPress={multipleClickHandler(() => {
              this.twitterDisconnect();
            })} disabled={this.state.disableButtons}>
            <View style={styles.itemParent}>
              <Image style={{ height: 24, width: 25.3, resizeMode: 'contain' }} source={twitterDisconnectIcon} />
              <Text style={styles.item}>Twitter Disconnect</Text>
            </View>
          </TouchableOpacity>

          {/*<TouchableOpacity   onPress={multipleClickHandler(() => {*/}
              {/*this.CurrentUserLogout();*/}
            {/*})} disabled={this.state.disableButtons}>*/}
            {/*<View style={styles.itemParent}>*/}
              {/*<Image style={{ height: 24, width: 25.3, resizeMode: 'contain' }} source={loggedOutIcon} />*/}
              {/*<Text style={styles.item}>Log out</Text>*/}
            {/*</View>*/}
          {/*</TouchableOpacity>*/}
        </View>
        <View style={{ alignItems: 'center', paddingVertical: 12 }}>
          <Text style={{ fontSize: 12 }}>
            Pepo v{DeviceInfo.getVersion()} ({DeviceInfo.getBuildNumber()})
          </Text>
        </View>
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
          <Image style={{ height: 24, width: 25.3, resizeMode: 'contain'  }} source={pepoAmountWallet} />
          <Text style={styles.item}>Wallet settings</Text>
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
    marginTop: 3,
    fontFamily: 'AvenirNext-Regular'
  }
});
