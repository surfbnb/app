import React, {Component} from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Text, View, Image } from 'react-native';
import { SafeAreaView, NavigationEvents } from 'react-navigation';
import { OstWalletSdk, OstWalletSdkUI, OstJsonApi } from '@ostdotcom/ost-wallet-sdk-react-native';
import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
import Colors from '../../theme/styles/Colors';
import loggedOutIcon from '../../assets/drawer-logout-icon.png';
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import Toast from '../../theme/components/NotificationToast';

import BackArrow from '../../assets/back-arrow.png';

export default class CustomDrawerContent extends Component{

  constructor() {
    super();
    this.userName = reduxGetter.getName(CurrentUser.getUserId());
    this.state = {
      disableButtons: false,
      disableResetPin: false,
      showAbortRecovery: false,
      showRecoverDevice: false
    };
    this.twitterDisconnect = this.twitterDisconnect.bind(this);
    this.CurrentUserLogout = this.CurrentUserLogout.bind(this);
    this.onWillFocus = this.onWillFocus.bind(this);
    
    this.updateOptions = this.updateOptions.bind(this);
    this.onDataFetched = this.onDataFetched.bind(this);

    // Render Methods.
    this.renderRecoverDevice = this.renderRecoverDevice.bind(this);
    this.renderAbortRecovery = this.renderAbortRecovery.bind(this);
    

    // Workflow Methods.
    this.resetPin = this.resetPin.bind(this);
    this.recoverDevice = this.recoverDevice.bind( this );
    this.abortRecovery = this.abortRecovery.bind( this );
  }

  twitterDisconnect() {
    this.setState({
      disableButtons: true
    }, () => {
      new PepoApi('/auth/twitter-disconnect')
      .post()
      .catch((error) => {
        Toast.show({
          text: 'Twitter Disconnect failed',
          icon: 'error'
        });
        this.setState({disableButtons: false})
      })
      .then(async (res) => {
        if (res && res.success) {
          this.CurrentUserLogout();
        } else {
          Toast.show({
            text: 'Twitter Disconnect failed',
            icon: 'error'
          });
          this.setState({disableButtons: false})
        }
      })
    });
  }

  CurrentUserLogout(){
    this.setState({
      disableButtons: true
    } , async () => {
      await CurrentUser.logout();
      setTimeout(()=> {
        this.setState({
          disableButtons: false
        });
      }, 300)
    });
  }

  componentDidMount() {
    this.updateOptions();
  }

  onWillFocus() {
   this.updateOptions();    
  }

  updateOptions() {
    let ostUserId = CurrentUser.getOstUserId();
    if ( null == ostUserId ) {
      this.setState({
        disableResetPin: true,
        showAbortRecovery: false,
        showRecoverDevice: false
      });
      return;
    }

    this.hasFetchedOstUserData = false;
    this.hasFetchedDeviceData = false;
    this.hasFetchedPendingRecoveryData = false;

    this.ostUserData = null;
    this.deviceData = null;
    this.pendingRecovery = null;

    OstWalletSdk.getUser(ostUserId, ( user ) => {
      this.ostUserData = user;
      this.hasFetchedOstUserData = true;
    });

    OstWalletSdk.getCurrentDeviceForUserId(ostUserId, ( device ) => {
      this.deviceData = device;
      this.hasFetchedDeviceData = true;
      this.onDataFetched();
    });

    OstJsonApi.getPendingRecoveryForUserId(ostUserId, ( data ) => {
      console.log("getPendingRecovery data", data);
      this.pendingRecovery = data;
      this.hasFetchedPendingRecoveryData = true;
      this.onDataFetched();
    }, ( error ) => {
      console.log("OstJsonApi.getPendingRecoveryForUserId :: error", error);
      // igonre error. Backend will give error ("UNPROCESSABLE_ENTITY") when no recovery in progress.
      this.pendingRecovery = null;
      this.hasFetchedPendingRecoveryData = true;
      this.onDataFetched();
    })
    
  }

  onDataFetched() {
    if ( !this.hasFetchedOstUserData || !this.hasFetchedDeviceData ) {
      // Wait for user and device data.
      return;
    }

    if ( !this.ostUserData || !this.deviceData || !this.canDeviceMakeOstApiCall(this.deviceData) ) {
      // Sdk can not make Api call.
      this.setState({
        disableResetPin: true,
        showAbortRecovery: false,
        showRecoverDevice: false
      });
      return;
    }

    let canAbortReovery = false;
    if ( this.hasFetchedPendingRecoveryData && this.pendingRecovery ) {
      canAbortReovery = true;
    }

    this.setState({
      disableResetPin: !this.canResetPin(this.ostUserData, this.deviceData),
      showAbortRecovery: canAbortReovery,
      showRecoverDevice: this.canRecoverDevice(this.ostUserData, this.deviceData, this.pendingRecovery)
    });

  }

  canDeviceMakeOstApiCall( device ) {
    if ( null === device ) {
      return false;
    }
    switch( device.status ) {
      case "REGISTERED":
      case "AUTHORIZING":
      case "AUTHORIZED":
      case "REVOKING":
        return true;
      default:
       return false;
    }
  }

  canResetPin( user, device ) {
    return true;
  }

  canRecoverDevice(user, device, pendingRecovery ) {
    if ( "ACTIVATED" === user.status && "REGISTERED" === device.status && !pendingRecovery ) {
        return true;
    } else {
      console.log("canRecoverDevice", "user.status", user.status, "device.status", device.status, "pendingRecovery", pendingRecovery);
    }
    return false;
  }


  resetPin() {
    let workflowId = OstWalletSdkUI.resetPin(
      CurrentUser.getOstUserId(),
      CurrentUser.newPassphraseDelegate()
    );

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (ostWorkflowContext , ostContextEntity) => {
      // Sdk event received.
    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
      // Sdk event received.
      console.log("resetPin workflow completed successfully");
    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
      console.log("resetPin :: ostError", ostError, "ostError.error.error_code:", ostError.error.error_code );
      if ( ostError.error.error_code === "WORKFLOW_CANCELLED") {
        console.log("resetPin :: Ignoring error");
        //ignore it.
        return;
      }

      //TODO: Show error somewhere.
    });
  }

  abortRecovery() {
    let workflowId = OstWalletSdkUI.abortDeviceRecovery(
      CurrentUser.getOstUserId(),
      CurrentUser.newPassphraseDelegate()
    );

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (ostWorkflowContext , ostContextEntity) => {
      // Sdk event received.
    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
      // Sdk event received.
      console.log("abortRecovery workflow completed successfully");
    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
      console.log("abortDeviceRecovery :: ostError", ostError, "ostError.error.error_code:", ostError.error.error_code );
      if ( ostError.error.error_code === "WORKFLOW_CANCELLED") {
        console.log("abortDeviceRecovery :: Ignoring error");
        //ignore it.
        return;
      }

      //TODO: Show error somewhere.
    });
  }

  recoverDevice() {
    let workflowId = OstWalletSdkUI.initiateDeviceRecovery(
      CurrentUser.getOstUserId(),
      null,
      CurrentUser.newPassphraseDelegate()
    );

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (ostWorkflowContext , ostContextEntity) => {
      
    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {
      console.log("recoverDevice workflow completed successfully");
    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {
      console.log("recoverDevice :: ostError", ostError, "ostError.error.error_code:", ostError.error.error_code );
      if ( ostError.error.error_code === "WORKFLOW_CANCELLED") {
        console.log("recoverDevice :: Ignoring error");
        //ignore it.
        return;
      }

      //TODO: Show error somewhere.
    });
  }

  renderRecoverDevice() {
    console.log("this.state.showRecoverDevice", this.state.showRecoverDevice);
    if ( !this.state.showRecoverDevice ) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.recoverDevice}>
        <View style={styles.itemParent}>
          <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
          <Text style={styles.item}>Recover Device</Text>
        </View>
      </TouchableOpacity>
    );
  }

  renderAbortRecovery() {
    if ( !this.state.showAbortRecovery ) {
      return null;
    }
    return (
      <TouchableOpacity onPress={this.abortRecovery}>
        <View style={styles.itemParent}>
          <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
          <Text style={styles.item}>Abort Recovery</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render(){
    return (
        <ScrollView style={styles.container}>
          <NavigationEvents 
            onWillFocus={this.onWillFocus}
          />
          <SafeAreaView forceInset={{ top: 'always' }}>
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
            <TouchableOpacity onPress={this.resetPin} disabled={this.state.disableResetPin}>
              <View style={styles.itemParent}>
                <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
                <Text style={styles.item}>Reset Pin</Text>
              </View>
            </TouchableOpacity>
            {this.renderRecoverDevice()}
            {this.renderAbortRecovery()}
            <TouchableOpacity onPress={this.CurrentUserLogout} disabled={this.state.disableButtons}>
              <View style={styles.itemParent}>
                <Image style={{ height: 24, width: 25.3 }} source={loggedOutIcon} />
                <Text style={styles.item}>Log out</Text>
              </View>
            </TouchableOpacity>
          </SafeAreaView>
        </ScrollView>
    );
  }

};

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
