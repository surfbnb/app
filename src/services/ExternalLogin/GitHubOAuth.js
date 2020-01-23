import qs from 'qs';

let GithubAuthService;
import('../../services/AuthServices/GithubAuthService').then((imports) => {
  GithubAuthService = imports.default;
});
import RemoteConfig from '../../services/RemoteConfig';
import Utilities from '../Utilities';


const GITHUB_BASE_URL = 'https://github.com/login/oauth';

const GitHubConfig = {
  clientId: RemoteConfig.getValue('GITHUB_CLIENT_ID'),
  clientSecret: RemoteConfig.getValue('GITHUB_CLIENT_SECRET'),
  redirectUrl: RemoteConfig.getValue('GITHUB_AUTH_CALLBACK_ROUTE'), 
  scopes: RemoteConfig.getValue('GITHUB_SCOPES')
}

class GitHubOAuth {


  /*
  * Called after github returns a code after authorization using which we fetch the access token.
  */
    handleRedirectSuccess = async( requestParams ) => {
      let params = {
        client_id : GitHubConfig.clientId,
        client_secret : GitHubConfig.clientSecret,
        redirect_uri : GitHubConfig.redirectUrl,
        code : requestParams.code
      },
      accesstokenUrl = `${GITHUB_BASE_URL}/access_token`;
     
      let formData;
      try {
        const response = await fetch(accesstokenUrl, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        });
        formData =  await response.formData();
      } catch (error) {
        Toast.show({text: `Failed to login via GitHub`, icon: 'error' });
        console.warn(error);
      }

      let tokenData = Utilities.formDataToJSON( formData );
      GithubAuthService.signUp(tokenData);
    }

    /*
    * Used to construct and return the auth url of github. Called from GithubWebLogin to load in webview.
    */
    getWebviewUrl = ()=> {
      let params = {
        client_id : GitHubConfig.clientId,
        redirect_uri : GitHubConfig.redirectUrl,
        scope : GitHubConfig.scopes,
        response_type : 'code'
      };
      let queryParams = qs.stringify(params);
      let githubRedirectURL = `${GITHUB_BASE_URL}/authorize?${queryParams}`;
      return githubRedirectURL;
    }

   
}

export default new GitHubOAuth();
