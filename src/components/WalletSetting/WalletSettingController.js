
import CurrentUser from '../../models/CurrentUser';
import { OstWalletSdk, OstWalletSdkUI, OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from "lodash/get";
import appConfig from '../../constants/AppConfig';
import OstWalletSdkHelper from '../../helpers/OstWalletSdkHelper'
import { SESSION_KEY_EXPIRY_TIME, SPENDING_LIMIT } from '../../constants';

const optionIds = {
  recoverDevice: 'recoverDevice',
  abortRecovery: 'abortRecovery',
  resetPin: 'resetPin',
  viewMnemonics: 'viewMnemonics',
  authorizeWithMnemonics: 'authorizeWithMnemonics',
  authorizeWithQR: 'authorizeWithQR',
  showQR: 'showQR',
  addSession: 'addSession',
  updateBiometricPreference: 'updateBiometricPreference'
};

class WalletSettingController {

  constructor() {
    this._initialize();
    this.optionsOrdering = [
      optionIds.addSession,
      optionIds.recoverDevice, optionIds.abortRecovery,
      optionIds.resetPin,
      optionIds.viewMnemonics, optionIds.authorizeWithMnemonics,
      optionIds.authorizeWithQR, optionIds.showQR,
      optionIds.updateBiometricPreference
    ];
    this.userStatusMap = appConfig.userStatusMap;
    this.deviceStatusMap = appConfig.deviceStatusMap;
    this.currentWorkflow = null;
    this.uiDelegate = null;
  }

  _initialize() {
    this.userId = CurrentUser.getOstUserId();
    this.optionsMap = {};
    this._initializeOptions();
  }

  _initializeOptions() {
    this._createOptionsData(optionIds.addSession, "Add Session", "Add Session to do transaction");
    this._createOptionsData(optionIds.recoverDevice, "Recover Device", "Recover your device");
    this._createOptionsData(optionIds.abortRecovery, "Abort Device Recovery", "Abort Device Recovery");
    this._createOptionsData(optionIds.resetPin, "Reset Pin", "Reset your wallet pin");
    this._createOptionsData(optionIds.viewMnemonics, "Show Device Mnemonics", "Please write down your 12-word mnemonic phrase");
    this._createOptionsData(optionIds.authorizeWithMnemonics, "Authorize Device with Mnemonics", "Authorize current device by using mnemonics");
    this._createOptionsData(optionIds.authorizeWithQR, "Scan QR to Authorize Device", "Scan QR Code of the new device to authorize it");
    this._createOptionsData(optionIds.showQR, "Show Device QR Code", "Scan QR Code from the device authorized device to authorize this device");
    this._createOptionsData(optionIds.updateBiometricPreference, "Update Biometric Preference", "Authenticate user with biometric");
  }

  refresh( callback, onlyPerformable ) {
    this._ensureUserIdValidity();
    onlyPerformable = onlyPerformable || false;

    if ( !this.userId ) {
      //Ost user id is null.
      setTimeout(()=> {
        let data = this._getData(onlyPerformable);
        callback( data );
      }, 0);

      // Done.
      return;
    }

    this.refreshCallback = callback;
    this.onlyPerformable = onlyPerformable;

    OstWalletSdk.getUser(this.userId, (userData) => {
      if ( !userData ) {
        // What to do here?
      }

      // Store user data.
      this.ostUser = userData;

      // Get the device.

      this._fetchBiometricPreference();
    });
  }

  _fetchBiometricPreference() {
    OstWalletSdk.isBiometricEnabled(this.userId, (isBiometricEnabled) => {
      this.isBiometricEnabled = isBiometricEnabled;
      this._fetchDevice();
    });
  }

  _fetchDevice() {
    OstWalletSdk.getCurrentDeviceForUserId(this.userId, (device) => {
      if( device && OstWalletSdkHelper.canDeviceMakeApiCall( device ) ) {
        this._fetchDeviceFromServer(device);
        return;
      }
      // Make do with what we have.
      this._onDeviceFetch(device);
    });
  }

  _fetchDeviceFromServer(localDevice) {
    OstJsonApi.getCurrentDeviceForUserId(this.userId,( device ) => {

      this._onDeviceFetch(device)

    }, ( error ) => {
      this._onDeviceFetch(localDevice)
    });
  }

  _onDeviceFetch(device) {
    let resultType = device["result_type"]
      , data = device[resultType]
    ;

    this.ostDevice = data;
    this.hasFetchedPendingRecoveryData = true;

    this._fetchPendingRecovery();
  }

  _fetchPendingRecovery() {
    OstJsonApi.getPendingRecoveryForUserId(this.userId, ( data ) => {
      this._onPendingRecoveryFetch(data)
    }, ( error ) => {
      this._onPendingRecoveryFetch(null)
    })
  }

  _onPendingRecoveryFetch(pendingRecovery) {
    this.pendingRecovery = pendingRecovery;
    this.hasFetchedPendingRecoveryData = true;

    this._onDataFetched()
  }

  _onDataFetched() {
    let deviceStatus = this._getDeviceStatus();
    let userStatus = this._getUserStatus();

    this._resetOptions();

    if (userStatus == this.userStatusMap.activated) {

      if (deviceStatus == this.deviceStatusMap.authorized) {
        this._updateOptionsData(optionIds.addSession, false, true);
        this._updateOptionsData(optionIds.viewMnemonics, false, true);
        this._updateOptionsData(optionIds.authorizeWithQR, false, true);

        let biometricMessage = (this.isBiometricEnabled || false) ? 'Disable Biometric Preference' : 'Enable Biometric Preference';
        this._updateOptionsData(optionIds.updateBiometricPreference, false, true, biometricMessage);
      }

      if (deviceStatus == this.deviceStatusMap.registered) {
        this._updateOptionsData(optionIds.recoverDevice, false, true);
        this._updateOptionsData(optionIds.authorizeWithMnemonics, false, true);
        this._updateOptionsData(optionIds.showQR, false, true);
      }

      if (null == this.pendingRecovery) {
        this._updateOptionsData(optionIds.abortRecovery, false, false);
        this._updateOptionsData(optionIds.resetPin, false, true);
      }else {
        this._updateOptionsData(optionIds.abortRecovery, false, true);
        this._updateOptionsData(optionIds.resetPin, false, false);

      }

      if (deviceStatus == this.deviceStatusMap.revoked) {
        this._initializeOptions()
      }

    }else {
      this._initializeOptions()
    }

    let data = this._getData(this.onlyPerformable);
    this.refreshCallback(data)
  }

  _resetOptions() {
    let cnt = 0, len = this.optionsOrdering.length;
    for ( cnt=0; cnt< len; cnt++ ) {
      let optionKey = this.optionsOrdering[cnt];
      let option = this.optionsMap[optionKey];
      option.inProgress = false;
      option.canPerform = false;
    }
  }

  _getData(onlyPerformable) {
    let filteredData = [];
    let cnt = 0, len = this.optionsOrdering.length;
    for ( cnt=0; cnt< len; cnt++ ) {
      let optionKey = this.optionsOrdering[ cnt ];
      let option = this.optionsMap[optionKey];
      if (onlyPerformable) {
        if ( !option.canPerform ){
          // Skip this.
          continue;
        }
      }

      filteredData.push(option);
    }

    return filteredData
  }

  _ensureUserIdValidity() {
    if ( !this._isUserIdValid() ) {
      this._initialize();
    }
  }

  _isUserIdValid() {
    return CurrentUser.getOstUserId() === this.userId;
  }

  _createOptionsData(id, heading, description){
    let optionsData = {
      id: id,

      // Heading
      heading: heading,

      // Description
      description: description,

      // Is this workflow in progress?
      inProgress: false,

      // Can the action be performed?
      // False by default. Hide the view when false.
      canPerform: false
    };

    this.optionsMap[ id ] = optionsData;
    return optionsData;
  }

  _updateOptionsData(id, inProgress, canPerform, message = null) {
    let optionData = this.optionsMap[id];
    optionData.inProgress = inProgress || false;
    optionData.canPerform = canPerform || false;

    if (message) {
      optionData.heading = message;
    }
  }

  _getUserStatus() {
    let uStatus = deepGet(this.ostUser, 'status') || '';
    return uStatus.toLowerCase();
  }

  _getDeviceStatus() {
    let dStatus = deepGet(this.ostDevice, 'status') || '';
    return dStatus.toLowerCase();
  }

  /**
   *
   * @param optionId
   *
   * @returns workflowInfo - Information of the workflow.
   */

  perform( optionId ) {
    if ( !this._isUserIdValid() ) {
      return null;
    }

    let activeWorkflow = this.getActiveWorkflowInfo();
    if ( activeWorkflow ) {
      return activeWorkflow;
    }

    let delegate = this._getWorkflowDelegate(),
        workflowId = null,
        userId = this.userId
    ;

    console.log("WalletSettings ost userId", userId);

    switch( optionId ) {
      case optionIds.addSession:
        workflowId = OstWalletSdkUI.addSession(userId, SESSION_KEY_EXPIRY_TIME, SPENDING_LIMIT, delegate);
        break;

      case optionIds.recoverDevice:
        workflowId = OstWalletSdkUI.initiateDeviceRecovery(userId, null, delegate);
        break;

      case optionIds.abortRecovery:
        workflowId = OstWalletSdkUI.abortDeviceRecovery(userId, delegate);
        break;

      case optionIds.resetPin:
        workflowId = OstWalletSdkUI.resetPin(userId, delegate);
        break;

      case optionIds.viewMnemonics:
        workflowId = OstWalletSdkUI.getDeviceMnemonics(userId, delegate);
        break;

      case optionIds.authorizeWithMnemonics:
        workflowId = OstWalletSdkUI.authorizeCurrentDeviceWithMnemonics(userId, delegate);
        break;

      case optionIds.authorizeWithQR:
        workflowId = OstWalletSdkUI.scanQRCodeToAuthorizeDevice(userId, delegate);
        break;

      case optionIds.showQR:
        workflowId = OstWalletSdkUI.getAddDeviceQRCode(userId, delegate);
        break;

      case optionIds.updateBiometricPreference:
        workflowId = OstWalletSdkUI.updateBiometricPreference(userId, !this.isBiometricEnabled, delegate);
        break;

      default:
        return null;
    }

    this.currentWorkflow = this._createWorkflowInfo(workflowId, optionId);

    return this.currentWorkflow;
  }

  getActiveWorkflowInfo() {
    let  workflowInfo = this.currentWorkflow;
    if ( !workflowInfo ) {
      return null;
    }
    if ( workflowInfo.isFlowInterrupted || workflowInfo.isFlowComplete ) {
      return null;
    }
    return workflowInfo;
  }

  _createWorkflowInfo(workflowId, optionId) {
    return {
      workflowId: workflowId,
      workflowOptionId: optionId,
      isRequestAcknowledge: false,
      isFlowInterrupted: false,
      isFlowComplete: false
    };
  }

  setUIDelegate( uiDelegate ) {
    this.uiDelegate = uiDelegate;
  }

  _getWorkflowDelegate() {
    let delegate = CurrentUser.newPassphraseDelegate();
    //
    delegate.requestAcknowledged = (ostWorkflowContext , ostContextEntity) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.requestAcknowledged(ostWorkflowContext, ostContextEntity);
      }

      this.currentWorkflow.isRequestAcknowledge = true
    };

    delegate.flowComplete = (ostWorkflowContext , ostContextEntity) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.flowComplete(ostWorkflowContext, ostContextEntity);
      }
      this.currentWorkflow.isFlowComplete = true
    };

    delegate.onUnauthorized = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.onUnauthorized(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.saltFetchFailed = () => {
      if ( this.uiDelegate ) {
        this.uiDelegate.saltFetchFailed();
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.userCancelled = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.userCancelled(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.deviceTimeOutOfSync = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.deviceTimeOutOfSync(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    delegate.workflowFailed = (ostWorkflowContext, ostError) => {
      if ( this.uiDelegate ) {
        this.uiDelegate.workflowFailed(ostWorkflowContext, ostError);
      }
      this.currentWorkflow.isFlowInterrupted = true
    };

    return delegate;
  }

};

const walletSettingController = new WalletSettingController();

export  {walletSettingController , optionIds}
