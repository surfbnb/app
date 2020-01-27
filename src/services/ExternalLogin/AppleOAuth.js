import appleAuth, {
  AppleAuthError,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import Toast from '../../theme/components/NotificationToast';
import {globalEvents,  globalEventsMap} from "../../helpers/GlobalEvents";

let AppleAuthService;
import('../../services/AuthServices/AppleAuthService').then((imports) => {
  AppleAuthService = imports.default;
});


class AppleOAuth {

    /*
    * The AppleAuth package method used to sign in
    */
    signIn = async () => {
      if(appleAuth.isSupported) {
        try {
        const response = await appleAuth.performRequest({
            requestedOperation: AppleAuthRequestOperation.LOGIN,
            requestedScopes: [
            AppleAuthRequestScope.EMAIL,
            AppleAuthRequestScope.FULL_NAME,
            ],
        });
        AppleAuthService.signUp( response );

        } catch (error) {
        if (error.code === AppleAuthError.CANCELED) {
          globalEvents.emit(globalEventsMap.oAuthCancel , error);
        } else {
          Toast.show({text: `Failed to login via Apple`, icon: 'error' });
          globalEvents.emit(globalEventsMap.oAuthError , error);
        }
        }
      }    
    };


    /*
    *Save response to async as apple return email and other details only on first login if needed( Not used for now)
    */

    // getUserDataFromAsync = ( response ) => {
    //   return AsyncStorage.getItem(`appleUser${response.user}`);
    // }

    
    // saveResponseToAsync = ( response )=> {
    //   if(!this.getUserDataFromAsync( response )){
    //     AsyncStorage.setItem(`appleUser${response.user}`, JSON.stringify(response));
    //   }
    // }
}

export default new AppleOAuth();
