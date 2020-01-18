import Base from './Base';
import CurrentUser from '../../models/CurrentUser';
import Toast from "../../theme/components/NotificationToast";


class GithubAuthService extends Base {
  constructor(params){
    super(params);
  }


  connectToServer(params) {
    return CurrentUser._signin('/auth/github-login', params);
  }


  getParamsForServer (params){
    return {
      access_token: params.access_token
    }
  }

  getPixelMandatoryParams(){
    return {
      e_entity: "user",
      e_action: "registration",
      p_type: "signin",
      p_name: "github"
    };
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Unable to login with Github',
      icon: 'error'
    });
  }

  logout() {
    // TwitterOAuth.signOut();
  }


}

export default new GithubAuthService();


