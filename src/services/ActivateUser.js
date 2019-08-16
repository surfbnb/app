import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import ActivateUserWorkflow from './OstWalletCallbacks/ActivateUserWorkflow';
import { SESSION_KEY_EXPIRY_TIME } from '../constants';
import { SPENDING_LIMIT } from '../constants';
import CurrentUser from '../models/CurrentUser';
import { hideModal } from '../actions';
import Store from '../store';
import deepGet from 'lodash/get';
import utilities from '../services/Utilities';

import { ostErrors } from '../services/OstErrors';

class ActivateUser {
  activateUser(pin, delegate) {
    CurrentUser
      .getUserSalt()
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            userSalt = deepGet(res, `data.${resultType}.scrypt_salt`);
          if (!userSalt) {
            this.onError();
            return;
          }
          OstWalletSdk.activateUser(
            CurrentUser.getOstUserId(),
            pin,
            userSalt,
            SESSION_KEY_EXPIRY_TIME,
            SPENDING_LIMIT,
            new ActivateUserWorkflow(delegate)
          );
        } else {
          this.onError(res);
        }
      })
      .catch((error) => {
        this.onError(error);
      });
  }

  onError(res) {
    utilities.showAlert(null, ostErrors.getErrorMessage(res));
  }
}

export default new ActivateUser();
