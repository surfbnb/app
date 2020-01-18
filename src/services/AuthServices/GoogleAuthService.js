import Base from './Base';
import CurrentUser from '../../models/CurrentUser';
import Toast from "../../theme/components/NotificationToast";


class GoogleAuthService extends Base {
  constructor(params){
    super(params);
  }


  connectToServer(params) {
    return CurrentUser._signin('/auth/google-login', params);
  }


  getParamsForServer (params){
    return {
      access_token: params.accessToken,
      refresh_token: params.refreshToken,
      expires_in: params.accessTokenExpirationDate
    }
  }

  getPixelMandatoryParams(){
    return {
      e_entity: "user",
      e_action: "registration",
      p_type: "signin",
      p_name: "google"
    };
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Unable to login with Google',
      icon: 'error'
    });
  }

  logout() {
    //
  }


}

export default new GoogleAuthService();


