import {OstWalletSdk, OstWalletSdkUI, OstJsonApi} from '@ostdotcom/ost-wallet-sdk-react-native';
import {SESSION_KEY_EXPIRY_TIME, SPENDING_LIMIT} from '../constants';
import {fetchDeviceByUserId} from "./SdkApihelpers";
import CurrentUser from "../models/CurrentUser";
import pricer from '../services/Pricer';
import Toast from '../theme/components/NotificationToast';
import {LoadingModal} from '../theme/components/LoadingModalCover';

function ensureTransaction(userId, btAmount, callback) {
  _checkDevice(userId, (validDevice) => {
    if (validDevice) {
      _checkBalance(userId, btAmount, (haveBalance) => {
        if (haveBalance) {
          _checkSessions(userId, btAmount, (haveSession) => {
            if (haveSession) {
              return callback(true);
            } else {

              let spendingLimit = SPENDING_LIMIT;
              let sessionKeyExpiryTime = SESSION_KEY_EXPIRY_TIME;
              if (btAmount > SPENDING_LIMIT) {
                spendingLimit = btAmount;
                sessionKeyExpiryTime = 60 * 60 * 2;
              }
              let workflowDelegate = _getWorkflowDelegate(callback);
              OstWalletSdkUI.addSession(userId, sessionKeyExpiryTime, spendingLimit, workflowDelegate);
            }
          })
        } else {
          Toast.show({
            text: 'Device Does not have enough balance',
            icon: 'error'
          });
          return callback(false);
        }
      });
    } else {
      Toast.show({
        text: 'Device is not authorized to do Transaction',
        icon: 'error'
      });
      return callback(false);
    }
  });
}

const _checkDevice = function (userId, deviceCallback) {
  fetchDeviceByUserId(userId)
    .then((device) => {
      if ("AUTHORIZED" === device.status) {
        return deviceCallback(true);
      }
      return deviceCallback(false);
    })
    .catch((err) => {
      return deviceCallback(false);
    });
};

const _checkBalance = function (userId, btAmount, balanceCallback) {
  pricer.getBalance((balance)=>{
    if (balance >= btAmount) {
      return balanceCallback(true);
    }
    return balanceCallback(false);
  },()=>{
    return balanceCallback(false);
  });
};

const _checkSessions = function (userId, btAmount, haveSessionCallback) {
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
    callback(true);
  };

  delegate.onUnauthorized = (ostWorkflowContext, ostError) => {
    LoadingModal.hide();
    callback(false);
  };

  delegate.saltFetchFailed = () => {
    LoadingModal.hide();
    callback(false);
  };

  delegate.userCancelled = (ostWorkflowContext, ostError) => {
    LoadingModal.hide();
    callback(false);
  };

  delegate.deviceTimeOutOfSync = (ostWorkflowContext, ostError) => {
    LoadingModal.hide();
    callback(false);
  };

  delegate.workflowFailed = (ostWorkflowContext, ostError) => {
    LoadingModal.hide();
    callback(false);
  };

  return delegate;
};
export {ensureTransaction}
