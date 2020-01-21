import Base from './Base';
import CurrentUser from '../../models/CurrentUser';
import Toast from "../../theme/components/NotificationToast";
import PepoApi from "../PepoApi";


class AppleAuthService extends Base {
  constructor(params){
    super(params);
  }

  connectToServer(params) {
    return CurrentUser._signin('/auth/apple-login', params);
  }

  getParamsForServer (params){
    return  params &&  Object.keys(params).length > 0 ?  {
      authorization_code : params.authorizationCode,
      authorized_scopes : params.authorizedScopes,
      email : params.email,
      full_name : params.fullName,
      nonce: params.nonce,
      identity_token : params.identityToken,
      real_user_status : params.realUserStatus,
      state: params.state,
      user: params.user
    } : {};
  }

  getPixelMandatoryParams(){
    const params = super.getPixelMandatoryParams();
    params["p_name"] = "apple";
    return params;
  }

  onServerError(error) {
    if (this.handleGoTo(error)) {
      return;
    }
    Toast.show({
      text: 'Unable to login with Apple',
      icon: 'error'
    });
  }

  logout() {
    this.beforLogout();
    new PepoApi('/auth/apple-disconnect')
      .post()
      .then(async (res) => {
        if (res && res.success) {
          this.onLogout();
        } else {
          Toast.show({
            text: 'Apple Disconnect failed',
            icon: 'error'
          });
        }
      })
      .catch((error) => {
        Toast.show({
          text: 'Apple Disconnect failed',
          icon: 'error'
        });
      });
  }
}

export default new AppleAuthService();


