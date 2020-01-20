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
    scopes: RemoteConfig.getValue('GOOGLE_SCOPES'),
    additionalParameters : {
        prompt : 'select_account'
    }
}

const GoogleAndroidConfig = {
    clientId: RemoteConfig.getValue('GOOGLE_ANDROID_CLIEND_ID'),
    redirectUrl: RemoteConfig.getValue('GOOGLE_ANDROID_REDIRECT_URI'),
};

const GoogleIOSConfig = {
    clientId: RemoteConfig.getValue('GOOGLE_IOS_CLIEND_ID'),
    redirectUrl: RemoteConfig.getValue('GOOGLE_IOS_REDIRECT_URI'),
  };

class GoogleOAuth {

    constructor(){
        this.authState = {
            refreshToken : null,
            accessToken : null,
            accessTokenExpirationDate : null,
            scopes : null
        }
    }

    getConfig = () => {
        let androidConfig = {
            ...BaseConfig, ...GoogleAndroidConfig
        },
        iosConfig = {
            ...BaseConfig, ...GoogleIOSConfig
        }
        if( Platform.OS == 'android') {
            return androidConfig;
        } else {
            return iosConfig;
        }
    }

    signIn = async() => {
       let response = await this.initiateSignUp();
       GoogleAuthService.signUp(response);
    }

    initiateSignUp = async () => {
        let authState = await this.authorize();
        return authState;
    }

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
            Toast.show({text: `Failed to login via Google`, icon: 'error' });
        }
    };

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
            Alert.alert(`Failed to refresh token`, error.message);
        }
    };

    revoke = async () => {
        try {
        await revoke(config, {
            tokenToRevoke: this.authState.accessToken,
            sendClientId: true
        });
        } catch (error) {
            Alert.alert(`Failed to revoke token`, error.message);
        }
    };
}

export default new GoogleOAuth();
