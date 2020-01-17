import { authorize, refresh, revoke } from 'react-native-app-auth';

const config = {
  issuer: 'https://accounts.google.com',
  clientId: '82182934708-621bbpcpag2gc653kd8f2lu0m23k250p.apps.googleusercontent.com',
  redirectUrl: 'com.googleusercontent.apps.82182934708-621bbpcpag2gc653kd8f2lu0m23k250p:/oauth2redirect/google',
  scopes: ['openid', 'profile']
};

// const config = {
//   clientId: '10ca594072962f391504',
//   clientSecret: 'c4566b51d00527d3f2db54634fdce8e9d00e8a2c',
//   redirectUrl: 'https://stagingpepo.com/app/github/oauth', //note: path is required
//   serviceConfiguration: {
//     authorizationEndpoint: 'https://github.com/login/oauth/authorize',
//     tokenEndpoint: `https://github.com/login/oauth/access_token`,
//     revocationEndpoint: `https://github.com/settings/connections/applications/10ca594072962f391504`
//   },
//   customHeaders :{
//     token : {
//       token_type: 'bearer'
//     }
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
