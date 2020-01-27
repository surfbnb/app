import qs from 'qs';

import RemoteConfig from '../../services/RemoteConfig';
import Oauth1Helper from '../../helpers/Oauth1';
import Utilities from '../Utilities';
import Toast from "../../theme/components/NotificationToast";

const TWITTER_BASE_URL = 'https://api.twitter.com/oauth';

let TwitterAuthService;
import('../../services/AuthServices/TwitterAuthService').then((imports) => {
  TwitterAuthService = imports.default;
});


class TwitterOAuth {

  constructor(){
    /*
    * Cache the token and secret to send later in the access token fetch request
    */
    this.requestToken = '';
    this.requestTokenSecret = '';
  }

  /*
  * Step 1: Fetch the request token used to construct the auth url
  */
  getRequestToken = async () => {
    let url = `${TWITTER_BASE_URL}/request_token`;
    let twitterRequestParams = {
        requestType: 'POST',
        completeUrl: url,
        authorizationHeader: { oauth_callback: RemoteConfig.getValue('TWITTER_AUTH_CALLBACK_ROUTE') },
        oAuthCredentials: {
            oAuthConsumerKey: RemoteConfig.getValue('TWITTER_CONSUMER_KEY'),
            oAuthConsumerSecret: RemoteConfig.getValue('TWITTER_CONSUMER_SECRET')
          }
      };

      let response = await this.fireRequest(twitterRequestParams);
      if(response){
        return Utilities.formDataToJSON(response);
      }
}


/*
* Method used to make api request with provided params for getting the request token and the access token
*/
fireRequest = async (twitterRequestParams) => {

    try {
      let requestParams = twitterRequestParams.requestParams || {},
      twitterAuthorizationHeader = {
        requestType: twitterRequestParams.requestType,
        url: twitterRequestParams.completeUrl,
        authorizationHeader: twitterRequestParams.authorizationHeader,
        oAuthCredentials: twitterRequestParams.oAuthCredentials,
        requestParams: requestParams
      };

      let authorizationHeader = await new Oauth1Helper(twitterAuthorizationHeader).perform();

      let responseData = await fetch(twitterRequestParams.completeUrl, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              Authorization: authorizationHeader.authorizationHeaderStr
          }
      });

      let formData = await responseData.formData();

      return formData;      
    } catch (error) {
      Toast.show({text: `Failed to login via Twitter`, icon: 'error' });
      console.warn(error);
    }
  }

  /*
  * Method used to construct the auth url and return it to the TwitterwebLogin component which opens it in a webview.
  */
  getWebviewUrl = async ()=> {
    let response = await this.getRequestToken();
    let {oauth_token, oauth_token_secret} = response;
    this.requestToken = oauth_token;
    this.requestTokenSecret = oauth_token_secret;
    let query_params = qs.stringify({
      oauth_token
    })
    let twitterRedirectUrl = `${TWITTER_BASE_URL}/authorize?${query_params}`;
    return twitterRedirectUrl;
  }

  /*
  * Called when twitter redirects to our specified redirect url with oauth_verifier which is then used to fetch the access token.
  */
  handleRequestTokenSuccess = async( params )=> {
    let accessParams ;
    try{
      accessParams = await this.getAccessToken(params);
    } catch (e) {
      Toast.show({text: `Failed to login via Twitter`, icon: 'error' });
      TwitterAuthService.signUp();
      return;
    }
    TwitterAuthService.signUp(accessParams);
  }

  /*
  * Method used to fetch the access token.
  */
   getAccessToken = async(params)=> {
    let accessTokenURL = `${TWITTER_BASE_URL}/access_token`;
    let {oauth_verifier} = params;

    let oAuthCredentials = {
        oAuthConsumerKey: RemoteConfig.getValue('TWITTER_CONSUMER_KEY'),
        oAuthConsumerSecret: RemoteConfig.getValue('TWITTER_CONSUMER_SECRET'),
        oAuthToken: this.requestToken,
        oAuthTokenSecret: this.requestTokenSecret
      },
      twitterRequestParams = {
        requestType: 'POST',
        completeUrl: accessTokenURL,
        oAuthCredentials: oAuthCredentials,
        authorizationHeader:{ oauth_verifier: oauth_verifier },
      };

    let response = await this.fireRequest(twitterRequestParams);

    return Utilities.formDataToJSON(response);
  }
}

export default new TwitterOAuth();
