import { authorize, refresh, revoke } from 'react-native-app-auth';
import PepoApi from '../PepoApi';

const config = {
  clientId: '58a09b55ccbcd1f6909f',
  clientSecret: '96bae48081191810aa8850456f9d279c672e0b42',
  redirectUrl: 'PepoStaging-08012020://oauth', //note: path is required
  serviceConfiguration: {
    authorizationEndpoint: 'https://github.com/login/oauth/authorize',
    tokenEndpoint: `https://github.com/login/oauth/access_token`,
    revocationEndpoint: `https://github.com/settings/connections/applications/58a09b55ccbcd1f6909f`
  },
  customHeaders :{
    token : {
      token_type: 'bearer'
    }
  },
  scopes: ['read:user', 'user:email']
}

class GitHubOAuth {

    constructor(){
        
    }

    signIn = async() => {
       this.authorize();
    }

    authorize = ()=> {
        new PepoApi('https://github.com/login/oauth/authorize')
        .then(()=> {

        })
        .catch((error)=>{
            console.log("github error", error);
        })
    }

   
}

export default new GitHubOAuth();
