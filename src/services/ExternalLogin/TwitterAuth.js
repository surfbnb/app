import { NativeModules } from 'react-native';

import RemoteConfig from '../../services/RemoteConfig';
const { RNTwitterSignIn } = NativeModules;

let twitterLoginParams = null;

class TwitterAuth {
  constructor(){
    RNTwitterSignIn.init(RemoteConfig.getValue('TWITTER_CONSUMER_KEY'), RemoteConfig.getValue('TWITTER_CONSUMER_SECRET'));
  }
  
  signIn() {
    return RNTwitterSignIn.logIn()
      .then((res) => {
        return this.__getLoginParamsFromTwitterResponse(res);
      })
      .catch((error) => {});
  }

  getCachedTwitterResponse() {
    return twitterLoginParams;
  }

  __getLoginParamsFromTwitterResponse(twitterResponse) {
    if (!twitterResponse) return null;
    twitterLoginParams = {
      token: twitterResponse.authToken,
      secret: twitterResponse.authTokenSecret,
      twitter_id: twitterResponse.userID,
      handle: twitterResponse.userName
    };
    return twitterLoginParams;
  }

  signOut() {
    RNTwitterSignIn.logOut();
  }
}

export default new TwitterAuth();
