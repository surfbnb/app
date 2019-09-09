
import CurrentUser from '../../models/CurrentUser';
import { OstWalletSdk, OstWalletSdkUI, OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';
import deepGet from "lodash/get";
import appConfig from '../../constants/AppConfig';

const optionIds = {
  recoverDevice: 'recoverDevice',
  abortRecovery: 'abortRecovery',
  resetPin: 'resetPin',
  viewMnemonics: 'viewMnemonics',
  authorizeWithMnemonics: 'authorizeWithMnemonics',
  authorizeWithQR: 'authorizeWithQR',
  showQR: 'showQR'
};

class WalletSettingController {

  constructor() {
    this._initialize();
    this.optionsOrdering = [
      optionIds.recoverDevice, optionIds.abortRecovery,
      optionIds.resetPin,
      optionIds.viewMnemonics, optionIds.authorizeWithMnemonics,
      optionIds.authorizeWithQR, optionIds.showQR
    ];
    this.userStatusMap = appConfig.userStatusMap;
    this.deviceStatusMap = appConfig.deviceStatusMap;
  }

  _initialize() {
    this.userId = CurrentUser.getOstUserId();
    this.optionsMap = {};
    this._initializeOptions();
  }

  _initializeOptions() {
    this._createOptionsData(optionIds.recoverDevice, "Recover Device", "Recover your device");
    this._createOptionsData(optionIds.abortRecovery, "Abort Device Recovery", "Abort Device Recovery");
    this._createOptionsData(optionIds.resetPin, "Reset Pin", "Reset your wallet pin");
    this._createOptionsData(optionIds.viewMnemonics, "Reset Pin", "Reset your wallet pin");
    this._createOptionsData(optionIds.authorizeWithMnemonics, "Authorize Device with Mnemonics", "Authorize current device by using mnemonics");
    this._createOptionsData(optionIds.authorizeWithQR, "Authorize Device with QR Code", "Scan QR Code of the new device to authorize it");
    this._createOptionsData(optionIds.showQR, "Authorize Device with QR Code", "Scan QR Code from the device authorized device to authorize this device");
  }

  refresh( callback, onlyPerformable ) {
    this._validateInstance();
    onlyPerformable = onlyPerformable || false;

    if ( !this.userId ) {
      //Ost user id is null.
      setTimeout(()=> {
        let data = this._getData(onlyPerformable);
        callback( data );
      }, 10);

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
      this._fetchDeviceFromServer();
    });
  }

  _fetchDeviceFromServer() {
    OstJsonApi.getCurrentDeviceForUserId(this.userId,( device ) => {

      this._onDeviceFetch(device)

    }, ( error ) => {
      this._onDeviceFetch(null)
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

    if (userStatus == this.userStatusMap.activated) {
      this._updateOptionsData(optionIds.resetPin, false, true);

      if (deviceStatus == this.deviceStatusMap.authorized) {
        this._updateOptionsData(optionIds.viewMnemonics, false, true);
        this._updateOptionsData(optionIds.authorizeWithQR, false, true);
      }

      if (deviceStatus == this.deviceStatusMap.registered) {
        this._updateOptionsData(optionIds.recoverDevice, false, true);
        this._updateOptionsData(optionIds.authorizeWithMnemonics, false, true);
        this._updateOptionsData(optionIds.showQR, false, true);
      }

      if (null == this.pendingRecovery) {
        this._updateOptionsData(optionIds.abortRecovery, false, false);
      }else {
        this._updateOptionsData(optionIds.abortRecovery, false, true);
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

  _validateInstance() {
    if ( CurrentUser.getOstUserId() !== this.userId ) {
      this._initialize();
    }
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

  _updateOptionsData(id, inProgress, canPerform) {
    let optionData = this.optionsMap[id];
    optionData.inProgress = inProgress || false;
    optionData.canPerform = canPerform || false;
  }

  _getUserStatus() {
    let uStatus = deepGet(this.ostUser, 'status') || '';
    return uStatus.toLowerCase();
  }

  _getDeviceStatus() {
    let dStatus = deepGet(this.ostDevice, 'status') || '';
    return dStatus.toLowerCase();
  }

};

const walletSettingController = new WalletSettingController();

export  {walletSettingController , optionIds}
