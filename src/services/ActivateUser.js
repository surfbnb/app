import AsyncStorage from '@react-native-community/async-storage';
import { Alert} from 'react-native';
import { OstWalletSdk } from '@ostdotcom/ost-wallet-sdk-react-native';
import ActivateUserWorkflow from './OstWalletCallbacks/ActivateUserWorkflow';
import { SESSION_KEY_EXPIRY_TIME } from '../constants';
import { SPENDING_LIMIT } from '../constants';
import currentUserModal from "../models/CurrentUser";
import { hideModal } from "../actions";
import Store from "../store"; 
import errorMessage from "../constants/ErrorMessages";
import deepGet from "lodash/get";

class ActivateUser {
  activateUser(pin, delegate) {
    currentUserModal.getUserSalt()
    .then( (res) => {
        if (res.success && res.data) {
            let resultType = deepGet(res, 'data.result_type'),
              userSalt = deepGet(res, `data.${resultType}.scrypt_salt`);
            if (!userSalt) {
              this.onError();
              return;
            }
            OstWalletSdk.activateUser(
              currentUserModal.getOstUserId(),
              pin,
              userSalt,
              SESSION_KEY_EXPIRY_TIME,
              SPENDING_LIMIT,
              new ActivateUserWorkflow(delegate)
            );
        }else{
          this.onError(); 
        }        
    }).catch( (error) => {
      this.onError();
    })
  }

  onError(){
    Store.dispatch(hideModal());
    Alert.alert("" , errorMessage.general_error) ;  
  }
}

export default new ActivateUser();
