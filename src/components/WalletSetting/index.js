import React, { PureComponent } from 'react';
import { FlatList, View, Text, TouchableWithoutFeedback, Alert } from 'react-native';
import inlineStyle from './styles'
import {walletSettingController, optionIds} from  './WalletSettingController';
import { LoadingModal } from '../../theme/components/LoadingModalCover';
import { OstWalletSdkUI } from '@ostdotcom/ost-wallet-sdk-react-native';
import CurrentUser from "../../models/CurrentUser";

class WalletSettingList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      refreshing: false,
    };

    this._initiateEventTextMap()
  }

  _initiateEventTextMap() {
    this.eventLoaderTextMap = {};

    this._createEventLoaderData(
      optionIds.resetPin,
      "Reset pin acknowledged",
      "Pin has been modified successfully",
      "Issue occurred while modifying pin");

    this._createEventLoaderData(
      optionIds.recoverDevice,
      "Recover device request acknowledged",
      "Device has been recovered successfully",
      "Issue occurred while recovering device");

    this._createEventLoaderData(
      optionIds.abortRecovery,
      "Recovery cancelled acknowledged",
      "Recovery cancelled successfully",
      "Issue occurred while canceling recovery");

    this._createEventLoaderData(
      optionIds.viewMnemonics,
      null,
      null,
      null);

    this._createEventLoaderData(
      optionIds.authorizeWithQR,
      "Authorize device request acknowledged",
      "Device authorized successfully",
      "Issue occurred while authorizing device");


    this._createEventLoaderData(
      optionIds.authorizeWithMnemonics,
      "Authorize device request acknowledged",
      "Device authorized successfully",
      "Issue occurred while authorizing device");

    this._createEventLoaderData(
      optionIds.showQR,
      "Device is authorizing",
      "Device authorized successfully",
      "Issue occured while checking device status");
  }

  _createEventLoaderData(id, ackText, successText, failureText){
    let loaderData = {
      id: id,

      // Acknowledgement text
      acknowledgedText: ackText,

      // Success Text
      successText: successText,

      // Failure Text
      failureText: failureText,
    };

    this.eventLoaderTextMap[ id ] = loaderData;
    return loaderData;
  }

  componentDidMount() {
    this.refreshList()
  }

  refreshList = () => {
    let refreshState = this.state.refreshing;

    LoadingModal.show("Fetching Setting");
    walletSettingController.refresh((optionsData) => {
      this.setState({
        list: optionsData,
        refreshing: !refreshState
      });
      LoadingModal.hide();
    }, true);
  };

  onSettingItemTapped = (item) => {
    let itemId = item.id
      , workflowId = null
    ;

    if (optionIds.recoverDevice === itemId) {
      workflowId = OstWalletSdkUI.initiateDeviceRecovery(
        CurrentUser.getOstUserId(),
        null,
        CurrentUser.newPassphraseDelegate()
      );
    }

    else if (optionIds.abortRecovery === itemId) {
      workflowId = OstWalletSdkUI.abortDeviceRecovery(CurrentUser.getOstUserId(), CurrentUser.newPassphraseDelegate())
    }

    else if (optionIds.viewMnemonics === itemId) {
      workflowId = OstWalletSdkUI.getDeviceMnemonics(CurrentUser.getOstUserId(), CurrentUser.newPassphraseDelegate())
    }

    else if (optionIds.authorizeWithMnemonics === itemId) {
      workflowId = OstWalletSdkUI.authorizeCurrentDeviceWithMnemonics(CurrentUser.getOstUserId(), CurrentUser.newPassphraseDelegate())
    }

    else if (optionIds.authorizeWithQR === itemId) {
      workflowId = OstWalletSdkUI.authorizeWithQR(CurrentUser.getOstUserId(), CurrentUser.newPassphraseDelegate())
    }

    else if (optionIds.showQR === itemId) {
      workflowId = OstWalletSdkUI.getAddDeviceQRCode(CurrentUser.getOstUserId(), CurrentUser.newPassphraseDelegate())
    }

    else if (optionIds.resetPin === itemId) {
      workflowId = OstWalletSdkUI.resetPin(CurrentUser.getOstUserId(), CurrentUser.newPassphraseDelegate())
    }

    if ( workflowId ) {
      this.currentWorkflow = itemId;
      this.subscribeToEvent(workflowId)
    }
  };

  subscribeToEvent(workflowId) {
    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.requestAcknowledged, (ostWorkflowContext , ostContextEntity) => {

      Alert.alert(
        ostWorkflowContext.WORKFLOW_TYPE,
        this.eventLoaderTextMap[this.currentWorkflow].acknowledgedText)

    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowComplete, (ostWorkflowContext , ostContextEntity) => {

      this.refreshList();

      Alert.alert(
        ostWorkflowContext.WORKFLOW_TYPE,
        this.eventLoaderTextMap[this.currentWorkflow].successText)

    });

    OstWalletSdkUI.subscribe(workflowId, OstWalletSdkUI.EVENTS.flowInterrupt, (ostWorkflowContext , ostError) => {

      Alert.alert(
        ostWorkflowContext.WORKFLOW_TYPE,
        this.eventLoaderTextMap[this.currentWorkflow].failureText)

    });
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={() => this.onSettingItemTapped(item)}>
        <View style={inlineStyle.listComponent}>
        <Text style={inlineStyle.title}>{item.heading}</Text>
        <Text style={inlineStyle.subtitle}>{item.description}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <View style= {inlineStyle.list}>
        <FlatList
          data={this.state.list}
          refreshing={this.state.refreshing}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
        />
      </View>
    );

  }
}

export default WalletSettingList;