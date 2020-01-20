import RemoteConfig from '../../services/RemoteConfig';
import Oauth1Helper from '../../helpers/Oauth1';
import Utilities from '../Utilities';
import Toast from "../../theme/components/NotificationToast";

const TWITTER_BASE_URL = 'https://api.twitter.com/oauth';
const TWITTER_OAUTH_URL='https://api.twitter.com/oauth/authorize?oauth_token=';

let TwitterAuthService;
import('../../services/AuthServices/TwitterAuthService').then((imports) => {
  TwitterAuthService = imports.default;
});


class TwitterOAuth {

  constructor(){
    this.requestToken = '';
    this.requestTokenSecret = '';
  }

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
      return Utilities.formDataToJSON(response);
}

fireRequest = async (twitterRequestParams) => {

    let requestParams = twitterRequestParams.requestParams || {},
      twitterAuthorizationHeader = {
        requestType: twitterRequestParams.requestType,
        url: twitterRequestParams.completeUrl,
        authorizationHeader: twitterRequestParams.authorizationHeader,
        oAuthCredentials: twitterRequestParams.oAuthCredentials,
        requestParams: requestParams
    };

    let authorizationHeader = await new Oauth1Helper(twitterAuthorizationHeader).perform();

    // if (authorizationHeader.isFailure()) {
    //     return Promise.reject(authorizationHeader);
    // }

    let responseData = await fetch(twitterRequestParams.completeUrl, {
        method: 'POST',
        headers: {
            // Accept: 'application/json',
            // 'Content-Type': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            Authorization: authorizationHeader.authorizationHeaderStr
        }
    });

    let formData = await responseData.formData();

    return formData;
  }

  getWebviewUrl = async ()=> {
    let response = await this.getRequestToken();
    let {oauth_token, oauth_token_secret} = response;
    this.requestToken = oauth_token;
    this.requestTokenSecret = oauth_token_secret;
    let twitterRedirectUrl = `${TWITTER_OAUTH_URL}${oauth_token}`;
    return twitterRedirectUrl;
  }

  handleRequestTokenSuccess = async( params )=> {
    let accessParams ;
    try{
      accessParams = await this.getAccessToken(params);
    } catch (e) {
      Toast.show({text: `Failed to login via Twitter`, icon: 'error' });
      TwitterAuthService.signUp({});
      return;
    }
    TwitterAuthService.signUp(accessParams);
  }

   getAccessToken = async(params)=> {
    let accessTokenURL = `${TWITTER_BASE_URL}/access_token`;
    let {oauth_token, oauth_verifier} = params;

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

      console.log("twitter params", twitterRequestParams);

    let response = await this.fireRequest(twitterRequestParams);

    return Utilities.formDataToJSON(response);
  }
}

export default new TwitterOAuth();
