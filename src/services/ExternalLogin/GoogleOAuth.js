import { Platform, Alert} from 'react-native';

import { authorize, refresh, revoke } from 'react-native-app-auth';
import RemoteConfig from '../../services/RemoteConfig';
import Toast from "../../theme/components/NotificationToast";

let GoogleAuthService;
import('../../services/AuthServices/GoogleAuthService').then((imports) => {
    GoogleAuthService = imports.default;
});

const BaseConfig = {
    issuer: 'https://accounts.google.com',
    scopes: RemoteConfig.getValue('GOOGLE_SCOPES').split(" "),
    additionalParameters : {
        prompt : 'select_account'
    }
}

class GoogleOAuth {

    constructor(){
        this.authState = {
            refreshToken : null,
            accessToken : null,
            accessTokenExpirationDate : null,
            scopes : null
        }
    }

    /*
    * Get the platform specific config
    */
    getConfig = () => {
        return {
            ...BaseConfig,
            ...Platform.select({
                ios: {
                    clientId: RemoteConfig.getValue('GOOGLE_IOS_CLIEND_ID'),
                    redirectUrl: RemoteConfig.getValue('GOOGLE_IOS_REDIRECT_URI'),
                },
                android: {
                    clientId: RemoteConfig.getValue('GOOGLE_ANDROID_CLIENT_ID'),
                    redirectUrl: RemoteConfig.getValue('GOOGLE_ANDROID_REDIRECT_URI'),
                },
              })
        }
    }

    /*
    * Call the Google sdk method to open it's webview with the auth url
    */
    signIn = async() => {
       let response = await this.authorize();
       GoogleAuthService.signUp(response);
    }

    /*
    * Opens a webview with gmail page asking for credentials
    */
    authorize = async () => {
        let config = this.getConfig();
        try {
            const authState = await authorize(config);
            this.authState = {
                refreshToken : authState.refreshToken,
                accessToken : authState.accessToken,
                accessTokenExpirationDate : authState.accessTokenExpirationDate,
                scopes : authState.scopes
                }
            return this.authState;
        } catch (error) {
             Toast.show({text: `Unable to login via Google`, icon: 'error' });
        }
    };

    /*
    * Refresh the access token ( Not Used )
    */
    refresh = async () => {
        try {
            const authState = await refresh(config, {
                refreshToken: this.authState.refreshToken
            });
            this.authState = {
                refreshToken : authState.refreshToken,
                accessToken : authState.accessToken,
                accessTokenExpirationDate : authState.accessTokenExpirationDate,
                scopes : authState.scopes
                }
        } catch (error) {
            Toast.show({text: `Failed to refresh token`, icon: 'error' });
        }
    };

    /*
    * Revoke the access token ( Not Used )
    */
    revoke = async () => {
        try {
        await revoke(config, {
            tokenToRevoke: this.authState.accessToken,
            sendClientId: true
        });
        } catch (error) {
            Toast.show({text: `Failed to revoke token`, icon: 'error' });
        }
    };
}

export default new GoogleOAuth();
