import { NativeModules } from 'react-native';
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from '../../constants';
const { RNTwitterSignIn } = NativeModules;

let twitterLoginParams = null;

class TwitterAuth {
  signIn() {
    RNTwitterSignIn.init(TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET);
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
