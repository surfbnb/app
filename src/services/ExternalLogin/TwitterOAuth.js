
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET, TWITTER_AUTH_CALLBACK_ROUTE } from '../../constants';

import Oauth1Helper from '../../helpers/Oauth1';

const TwitterBase = 'https://api.twitter.com/oauth';
const TWITTER_OAUTH_URL='https://api.twitter.com/oauth/authorize?oauth_token=';

class TwitterOAuth {

  constructor(){
    this.requestToken = '';
    this.requestTokenSecret = '';
  }

  getRequestToken = async () => {
    let url = `${TwitterBase}/request_token`;
    let twitterRequestParams = {
        requestType: 'POST',
        completeUrl: url,
        authorizationHeader: { oauth_callback: TWITTER_AUTH_CALLBACK_ROUTE },
        oAuthCredentials: {
            oAuthConsumerKey: TWITTER_CONSUMER_KEY,
            oAuthConsumerSecret: TWITTER_CONSUMER_SECRET
          }
      };

      let response = await this.fireRequest(twitterRequestParams);
      return this.formDataToJSON(response);
}

formDataToJSON = (formData)=> {
    var object = {};
    for (let p in formData){
        formData[p].forEach((item)=> {
            object[item[0]] = item[1]
        });
    }
    return object;
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
    let accessToken = await this.getAccessToken(params);
    console.log("acce3sstoken", accessToken);
  }

   getAccessToken = async(params)=> {
    let accessTokenURL = `${TwitterBase}/access_token`;
    let {oauth_token, oauth_verifier} = params;

    let oAuthCredentials = {
        oAuthConsumerKey: TWITTER_CONSUMER_KEY,
        oAuthConsumerSecret: TWITTER_CONSUMER_SECRET,
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

    return this.formDataToJSON(response);
  } 
}

export default new TwitterOAuth();
