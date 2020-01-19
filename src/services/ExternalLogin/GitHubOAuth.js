import qs from 'qs';

let GithubAuthService;
import('../../services/AuthServices/GithubAuthService').then((imports) => {
  GithubAuthService = imports.default;
});
import RemoteConfig from '../../services/RemoteConfig';


const GITHUB_BASE_URL = 'https://github.com/login/oauth';
const GITHUB_OAUTH_URL = '/authorize';
const GITHUB_ACCESS_TOKEN_URL = '/access_token';

const GitHubConfig = {
  clientId: RemoteConfig.getValue('GITHUB_CLIENT_ID'),
  clientSecret: RemoteConfig.getValue('GITHUB_CLIENT_SECRET'),
  redirectUrl: RemoteConfig.getValue('GITHUB_AUTH_CALLBACK_ROUTE'), 
  scopes: RemoteConfig.getValue('GITHUB_SCOPES')
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
      accesstokenUrl = `${GITHUB_BASE_URL}${GITHUB_ACCESS_TOKEN_URL}`;
     
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
    }

    getWebviewUrl = ()=> {
      let params = {
        client_id : GitHubConfig.clientId,
        redirect_uri : GitHubConfig.redirectUrl,
        scope : GitHubConfig.scopes,
        response_type : 'code'
      };
      let queryParams = qs.stringify(params);
      let githubRedirectURL = `${GITHUB_BASE_URL}${GITHUB_OAUTH_URL}?${queryParams}`;
      return githubRedirectURL;
    }

   
}

export default new GitHubOAuth();
