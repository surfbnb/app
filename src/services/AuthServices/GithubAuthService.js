import Base from './Base';
import CurrentUser from '../../models/CurrentUser';
import Toast from "../../theme/components/NotificationToast";
import PepoApi from "../PepoApi";


class GithubAuthService extends Base {
  constructor(params){
    super(params);
  }


  connectToServer(params) {
    return CurrentUser._signin('/auth/github-login', params);
  }


  getParamsForServer (params){
    return  params &&  Object.keys(params).length > 0 ?  {access_token: params.access_token, raw_connect_params: params} : {};
  }

  getPixelMandatoryParams(){
    const params = super.getPixelMandatoryParams();
    params["p_name"] = "github";
    return params;
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
    this.beforLogout();
    new PepoApi('/auth/github-disconnect')
      .post()
      .then(async (res) => {
        if (res && res.success) {
          this.onLogout();
        } else {
          Toast.show({
            text: 'Github Disconnect failed',
            icon: 'error'
          });
        }
      })
      .catch((error) => {
        Toast.show({
          text: 'Github Disconnect failed',
          icon: 'error'
        });
      });
  }


}

export default new GithubAuthService();


