import GithubAuthService from '../services/AuthServices/GithubAuthService';
import TwitterAuthService from '../services/AuthServices/TwitterAuthService';
import AppleAuthService from '../services/AuthServices/AppleAuthService';
import GoogleAuthService from '../services/AuthServices/GoogleAuthService'
import AppConfig from '../constants/AppConfig';

const authService = function(authServiceString){

  switch (authServiceString) {
    case AppConfig.authServiceTypes.twitter:
      return TwitterAuthService;
    case AppConfig.authServiceTypes.apple:
      return AppleAuthService;
    case AppConfig.authServiceTypes.github:
      return GithubAuthService;
    case AppConfig.authServiceTypes.google:
      return GoogleAuthService;
  }
  return null;
};

export default authService;
