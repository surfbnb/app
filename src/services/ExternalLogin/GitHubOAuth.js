import qs from 'qs';

import { GITHUB_AUTH_CALLBACK_ROUTE } from '../../constants';

let GithubAuthService;
import('../../services/AuthServices/GithubAuthService').then((imports) => {
  GithubAuthService = imports.default;
});


const GithubBase = 'https://github.com/login/oauth';
const GITHUB_OAUTH_URL = '/authorize';
const GITHUB_ACCESS_TOKEN_URL = '/access_token';

const GitHubConfig = {
  clientId: '58a09b55ccbcd1f6909f',
  clientSecret: '96bae48081191810aa8850456f9d279c672e0b42',
  redirectUrl: GITHUB_AUTH_CALLBACK_ROUTE, 
  scopes: 'read:user user:email'
}

class GitHubOAuth {

    formDataToJSON = (formData)=> {
      var object = {};
      for (let p in formData){
          formData[p].forEach((item)=> {
              object[item[0]] = item[1]
          });
      }
      return object;
  }

    handleRedirectSuccess = async( requestParams ) => {
      let params = {
        client_id : GitHubConfig.clientId,
        client_secret : GitHubConfig.clientSecret,
        redirect_uri : GitHubConfig.redirectUrl,
        code : requestParams.code
      },
      accesstokenUrl = `${GithubBase}${GITHUB_ACCESS_TOKEN_URL}`;
     
        const response = await fetch(accesstokenUrl, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        });
        let formData =  await response.formData();
        let tokenData = this.formDataToJSON( formData );
        GithubAuthService.signUp(tokenData);
        // console.log(tokenData);
    }

    getWebviewUrl = ()=> {
      let params = {
        client_id : GitHubConfig.clientId,
        redirect_uri : GitHubConfig.redirectUrl,
        scope : GitHubConfig.scopes,
        response_type : 'code'
      };
      let queryParams = qs.stringify(params);
      let githubRedirectURL = `${GithubBase}${GITHUB_OAUTH_URL}?${queryParams}`;
      return githubRedirectURL;
    }

   
}

export default new GitHubOAuth();
