import { Alert } from 'react-native';
import { authorize, refresh, revoke } from 'react-native-app-auth';

// const config = {
//   issuer: 'https://demo.identityserver.io',
//   clientId: 'native.code',
//   redirectUrl: 'io.identityserver.demo:/oauthredirect',
//   additionalParameters: {},
//   scopes: ['openid', 'profile', 'email', 'offline_access']

//   // serviceConfiguration: {
//   //   authorizationEndpoint: 'https://demo.identityserver.io/connect/authorize',
//   //   tokenEndpoint: 'https://demo.identityserver.io/connect/token',
//   //   revocationEndpoint: 'https://demo.identityserver.io/connect/revoke'
//   // }
// };

const config = {
  issuer: 'https://accounts.google.com',
  clientId: '244190786286-nf5vscpeh5bclog3f89klr8s4v5afgtl.apps.googleusercontent.com',
  redirectUrl: 'com.googleusercontent.apps.244190786286-nf5vscpeh5bclog3f89klr8s4v5afgtl:/oauth2redirect/google',
  scopes: ['openid', 'profile']
};

// const config = {
//   clientId: '58a09b55ccbcd1f6909f',
//   clientSecret: '96bae48081191810aa8850456f9d279c672e0b42',
//   redirectUrl: 'PepoStaging-08012020://oauth', //note: path is required
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://github.com/login/oauth/authorize',
//     tokenEndpoint: `https://github.com/login/oauth/access_token`,
//     revocationEndpoint: `https://github.com/settings/connections/applications/58a09b55ccbcd1f6909f`
//   },
//   customHeaders :{
//     token : {
//       token_type: 'bearer'
//     }
//   },
//   scopes: ['read:user', 'user:email']
// }

// const config = {
//   clientId: 'NEo4gEXzdQZaoTsqzpZvepfKb',
//   clientSecret: 'iM5UMt4px8rwoqEoRV9gJGrJGtEoMUxOYkaWXSges7t4bk564t',
//   redirectUrl: 'twitterkit-NEo4gEXzdQZaoTsqzpZvepfKb://', //note: path is required
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://api.twitter.com/oauth/authorize',
//     tokenEndpoint: `https://api.twitter.com/oauth/request_token`,
//     revocationEndpoint: `https://api.twitter.com/1.1/oauth/invalidate_token`
//   },
//   scopes: ['read:user', 'user:email']
// }

class GmailOAuth {

    constructor(){
        this.authState = {
            refreshToken : null,
            accessToken : null,
            accessTokenExpirationDate : null,
            scopes : null
        }
    }

    signIn = async() => {
       let response = await this.initiateSignUp();
       response.success = true;
       return response;
    }

    initiateSignUp = async () => {
        let authState = await this.authorize();
        return authState;
    }

    authorize = async () => {
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
            Promise.reject(`Failed to log in ${error.message}`);
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
            Promise.reject(`Failed to refresh token ${error.message}`);
        }
    };

    revoke = async () => {
        try {
        await revoke(config, {
            tokenToRevoke: this.authState.accessToken,
            sendClientId: true
        });
        } catch (error) {
            Promise.reject(`Failed to revoke token ${error.message}`);
        }
    };
}

export default new GmailOAuth();
