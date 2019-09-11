import React, {PureComponent} from 'react';
import {Alert, FlatList, Text, TouchableWithoutFeedback, View} from 'react-native';
import inlineStyle from './styles'
import {optionIds, walletSettingController} from './WalletSettingController';
import {LoadingModal} from '../../theme/components/LoadingModalCover';
import Colors from "../../theme/styles/Colors";
import BackArrow from '../CommonComponents/BackArrow';

class WalletSettingList extends PureComponent {
  static navigationOptions = (options) => {
    return {
      title: 'Wallet Settings',
      headerBackTitle: null,
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerBackImage: <BackArrow />
    };
  };

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
      "Resetting pin",
      "Reset pin acknowledged",
      "Pin has been modified successfully",
      "Issue occurred while modifying pin");

    this._createEventLoaderData(
      optionIds.recoverDevice,
      "Recovering device",
      "Recover device request acknowledged",
      "Device has been recovered successfully",
      "Issue occurred while recovering device");

    this._createEventLoaderData(
      optionIds.abortRecovery,
      "Cancelling recovery",
      "Recovery cancelled acknowledged",
      "Recovery cancelled successfully",
      "Issue occurred while canceling recovery");

    this._createEventLoaderData(
      optionIds.viewMnemonics,
      null,
      null,
      null,
      null);

    this._createEventLoaderData(
      optionIds.authorizeWithQR,
      "Authorizing device",
      "Authorize device request acknowledged",
      "Device authorized successfully",
      "Issue occurred while authorizing device");


    this._createEventLoaderData(
      optionIds.authorizeWithMnemonics,
      "Authorizing device",
      "Authorize device request acknowledged",
      "Device authorized successfully",
      "Issue occurred while authorizing device");

    this._createEventLoaderData(
      optionIds.showQR,
      null,
      "Device is authorizing",
      "Device authorized successfully",
      null);
  }

  _createEventLoaderData(id, startText, ackText, successText, failureText){
    let loaderData = {
      id: id,

      startText: startText,

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
    let workflowInfo = walletSettingController.perform(item.id);
    if ( workflowInfo ) {
      this.onWorkflowStarted( workflowInfo );
    } else {
      //Some coding error occurred.
      console.log("PepoError", "ws_indx_osit_1", "Some coding error occurred");
    }
  };

  onWorkflowStarted = (workflowInfo) => {
    this.workflowInfo = workflowInfo;
    // Show loader.
    let text = this.eventLoaderTextMap[this.workflowInfo.workflowOptionId].startText;
    if (text) {
      LoadingModal.show(text);
    }

    // Subscribe to events.
    walletSettingController.setUIDelegate(this);
  };

  requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
    let ackText = this.eventLoaderTextMap[this.workflowInfo.workflowOptionId].acknowledgedText;

    if (ackText) {
      Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, ackText)
    }
  };

  flowComplete = (ostWorkflowContext , ostContextEntity) => {
    LoadingModal.hide();

    setTimeout(() => {
      this.refreshList();
    }, 0);

    setTimeout(() => {
      let successText = this.eventLoaderTextMap[this.workflowInfo.workflowOptionId].successText;

      if (successText) {
        Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, successText)
      }
    }, 300);
    
  };

  onUnauthorized = (ostWorkflowContext , ostError) => {

    LoadingModal.hide();
    setTimeout(()=> {
      Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, "Device is unauthorized. Please logout and login")
    }, 0);
  };

  saltFetchFailed = (ostWorkflowContext , ostError) => {
    LoadingModal.hide();
    setTimeout(()=> {
      Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, "Getting salt from server failed.")
    }, 0);
  };

  userCancelled = (ostWorkflowContext , ostError) => {
     LoadingModal.hide();
     setTimeout(()=> {
       Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, "User cancelled.")
     },  0);
  };

  deviceTimeOutOfSync = (ostWorkflowContext , ostError) => {
    LoadingModal.hide();
    Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, "Device time out of sync")
  };

  workflowFailed = (ostWorkflowContext , ostError) => {
    LoadingModal.hide();
    setTimeout(()=> {
      Alert.alert(ostWorkflowContext.WORKFLOW_TYPE, ostError.getErrorMessage())
    },0);
  };


  _keyExtractor = (item, index) => `id_${item.id}`;

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
