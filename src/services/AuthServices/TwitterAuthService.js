import Base from './Base';
import CurrentUser from '../../models/CurrentUser';
import Toast from "../../theme/components/NotificationToast";


class TwitterAuthService extends Base {
  constructor(params){
    super(params);
  }


  connectToServer(params) {
    return CurrentUser._signin('/auth/twitter-login', params);
  }


  getParamsForServer (params){
    return {
      token: params.oauth_token,
      secret: params.oauth_token_secret,
      twitter_id: params.user_id,
      handle: params.screen_name
    }
  }

  getPixelMandatoryParams(){
    return {
      e_entity: "user",
      e_action: "registration",
      p_type: "signin",
      p_name: "twitter"
    };
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Unable to login with Twitter',
      icon: 'error'
    });
  }

  logout() {
    // TwitterOAuth.signOut();
  }


}

export default new TwitterAuthService();


