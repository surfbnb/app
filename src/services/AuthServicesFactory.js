let GithubAuthService,TwitterAuthService, AppleAuthService,GoogleAuthService;
import('../services/AuthServices/GithubAuthService').then((imports) => {
  GithubAuthService = imports.default;
});

import('../services/AuthServices/TwitterAuthService').then((imports) => {
  TwitterAuthService = imports.default;
});
import('../services/AuthServices/AppleAuthService').then((imports) => {
  AppleAuthService = imports.default;
});

import('../services/AuthServices/GoogleAuthService').then((imports) => {
  GoogleAuthService = imports.default;
});

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
