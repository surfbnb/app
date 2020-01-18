import Base from './Base';
import CurrentUser from '../../models/CurrentUser';
import Toast from "../../theme/components/NotificationToast";


class AppleAuthService extends Base {
  constructor(params){
    super(params);
  }

  connectToServer(params) {
    return CurrentUser._signin('/auth/apple-login', params);
  }

  getParamsForServer (params){
    console.log(params, 'Apple Params');
    return {
      authorization_code : params.authorizationCode,
      authorized_scopes : params.authorizedScopes,
      email : params.email,
      full_name : params.fullName,
      nonce: params.nonce,
      identity_token : params.identityToken,
      real_user_status : params.realUserStatus,
      state: params.state,
      user: params.user
    }
  }

  getPixelMandatoryParams(){
    return {
      e_entity: "user",
      e_action: "registration",
      p_type: "signin",
      p_name: "apple"
    };
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
    
  }
}

export default new AppleAuthService();


