import BigNumber from 'bignumber.js';
import {OstWalletSdk, OstWalletSdkUI, OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';
import {
  IS_PRODUCTION, DEFAULT_SESSION_KEY_EXPIRY_TIME, DEFAULT_SPENDING_LIMIT, MAX_SPENDING_LIMIT,
  HIGH_SPEND_SESSION_KEY_EXPIRY_TIME, MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME
} from '../constants';
import CurrentUser from "../models/CurrentUser";
import pricer from '../services/Pricer';
import Toast from '../theme/components/NotificationToast';
import {LoadingModal} from '../theme/components/LoadingModalCover';
import {ostSdkErrors, WORKFLOW_CANCELLED_MSG} from '../services/OstSdkErrors';
import {ostErrors} from "../services/OstErrors";
import {VideoPlayPauseEmitter} from './Emitters'


const ON_USER_CANCLLED_ERROR_MSG = WORKFLOW_CANCELLED_MSG;
const bnDefaultSpendingLimit = new BigNumber(DEFAULT_SPENDING_LIMIT);
const bnMaxSpendingLimit = new BigNumber(MAX_SPENDING_LIMIT);
const bnOne = new BigNumber(1);

const ensureSession = (userId, btAmount, callback) => {
  _hasSessions(userId, btAmount, ( hasSessions ) => {
    if ( hasSessions ) {
      // Session is present.
      return callback(null, true);
    }
    _onNoSessions(userId, btAmount, callback);

  })
};

const _onNoSessions = (userId, btAmount, callback) => {
  _hasAuthorizedDevice(userId, ( hasAuthorizedDevice ) => {
    if ( !hasAuthorizedDevice ) {
      let errorMessage = "Device Unauthorized";
      return callback(errorMessage, false);
    }
    _onHasAuthoirizedDevice(userId, btAmount, callback);
  })
};

const _onHasAuthoirizedDevice = (userId, btAmount, callback) => {
  let spendingLimit = DEFAULT_SPENDING_LIMIT;
  let sessionKeyExpiryTime = DEFAULT_SESSION_KEY_EXPIRY_TIME;

  let bnBtAmount = new BigNumber(btAmount);

  if ( bnBtAmount.gt(bnMaxSpendingLimit) ) {
    //Create a short-lived session.
    spendingLimit = bnBtAmount.plus( bnOne ).toString( 10 );
    sessionKeyExpiryTime = HIGH_SPEND_SESSION_KEY_EXPIRY_TIME;
  } else if ( bnBtAmount.gt(bnDefaultSpendingLimit) ) {
    // Create a medium-lived session
    spendingLimit = bnMaxSpendingLimit.toString( 10 );
    sessionKeyExpiryTime = MEDIUM_SPEND_SESSION_KEY_EXPIRY_TIME;
  } else {
    spendingLimit = bnDefaultSpendingLimit.toString( 10 );
    sessionKeyExpiryTime = DEFAULT_SESSION_KEY_EXPIRY_TIME;
  }

  let workflowDelegate = _getWorkflowDelegate(callback);
  VideoPlayPauseEmitter.emit('pause');
  OstWalletSdkUI.addSession(userId, sessionKeyExpiryTime, spendingLimit, workflowDelegate);
};


const _hasAuthorizedDevice = function (userId, deviceCallback) {
  OstWalletSdk.getCurrentDeviceForUserId(userId, (device) => {
    if (device && "AUTHORIZED" === device.status) {
      deviceCallback(true);
    } else {
      deviceCallback(false);
    }
  });
};

const _hasSessions = function (userId, btAmount, haveSessionCallback) {
  OstWalletSdk.getActiveSessionsForUserId(userId, btAmount, (activeSessions) => {
    if (activeSessions && activeSessions.length > 0) {
      haveSessionCallback(true);
    } else {
      haveSessionCallback(false);
    }
  });
};

const _getWorkflowDelegate = function (callback) {
  let delegate = CurrentUser.newPassphraseDelegate();
  //
  delegate.requestAcknowledged = (ostWorkflowContext, ostContextEntity) => {
    LoadingModal.show("Creating Session...");
  };

  delegate.flowComplete = (ostWorkflowContext, ostContextEntity) => {
    LoadingModal.hide();
    callback(null, true);
  };

  const onSdkError = (ostWorkflowContext, ostError) => {
    LoadingModal.hide();
    let errorMessage = ostSdkErrors.getErrorMessage(ostWorkflowContext, ostError);
    callback(errorMessage, false);
  };

  delegate.onUnauthorized = onSdkError;
  delegate.deviceTimeOutOfSync = onSdkError;
  delegate.workflowFailed = onSdkError;
  delegate.userCancelled = (ostWorkflowContext, ostError) => {
    //Do nothing.
    LoadingModal.hide();
    callback(ON_USER_CANCLLED_ERROR_MSG, false);
  };

  delegate.saltFetchFailed = ( response ) => {
    LoadingModal.hide();
    let errorMessage = ostErrors.getErrorMessage( response );
    callback(errorMessage, false);
  };

  return delegate;
};



function ensureTransaction(userId, btAmount, callback) {

  _checkBalance(userId, btAmount, (hasBalance) => {
    if (hasBalance) {

      _hasSessions(userId, btAmount, (haveSession) => {
        if (haveSession) {
          return callback(true);
        } else {

          _hasAuthorizedDevice(userId, (validDevice) => {
            if (validDevice) {
              let spendingLimit = DEFAULT_SPENDING_LIMIT;
              let sessionKeyExpiryTime = DEFAULT_SESSION_KEY_EXPIRY_TIME;
              if ( (new BigNumber(btAmount)).gt(new BigNumber(DEFAULT_SPENDING_LIMIT)) ) {
                spendingLimit = (new BigNumber(btAmount).plus( new BigNumber(1000000000000000000) )).toString();
                sessionKeyExpiryTime = 60 * 60 * 1;
              }
              let workflowDelegate = _getWorkflowDelegate(callback);
              OstWalletSdkUI.addSession(userId, sessionKeyExpiryTime, spendingLimit, workflowDelegate);
            } else {
              Toast.show({
                text: 'Device is not authorized to do Transaction',
                icon: 'error'
              });
              return callback(false);
            }
          });
        }
      });
    } else {
      Toast.show({
        text: 'Device does not have enough balance',
        icon: 'error'
      });
      return callback(false);
    }
  });
}
const _checkBalance = function (userId, btAmount, balanceCallback) {
  pricer.getBalance((balance) => {
    if ((new BigNumber(balance)).gte(new BigNumber(btAmount))) {
      return balanceCallback(true);
    }
    return balanceCallback(false);
  }, () => {
    return balanceCallback(false);
  });
};


export {ensureTransaction, ensureSession, ON_USER_CANCLLED_ERROR_MSG}
