import { Platform, Alert} from 'react-native';

import { authorize, refresh, revoke } from 'react-native-app-auth';

let GoogleAuthService;
import('../../services/AuthServices/GoogleAuthService').then((imports) => {
    GoogleAuthService = imports.default;
});

const GoogleAndroidConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '82182934708-rgk37rbb4jojhb27cjbood88d014n8f8.apps.googleusercontent.com',
    redirectUrl: 'com.pepo.staging:/oauth2callback',
    scopes: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile',
             'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly'],
    additionalParameters : {
        prompt : 'select_account'
    }
};

const GoogleIOSConfig = {
    issuer: 'https://accounts.google.com',
    clientId: '82182934708-nkbb3ta4piprjh9bpu8937b16aq3mik4.apps.googleusercontent.com',
    redirectUrl: 'com.googleusercontent.apps.82182934708-nkbb3ta4piprjh9bpu8937b16aq3mik4:/oauth2redirect/google',
    scopes: ['https://www.googleapis.com/auth/userinfo.email','https://www.googleapis.com/auth/userinfo.profile',
             'https://www.googleapis.com/auth/calendar.readonly', 'https://www.googleapis.com/auth/contacts.readonly'],
    additionalParameters : {
        prompt : 'select_account'
    }
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
        if( Platform.OS == 'android') {
            return GoogleAndroidConfig;
        } else {
            return GoogleIOSConfig;
        }
    }

    signIn = async() => {
       let response = await this.initiateSignUp();
       console.log('Hey signing in');
       GoogleAuthService.signUp(response);
       console.log(response);
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
            Alert.alert(`Failed to log in`, error.message);
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
