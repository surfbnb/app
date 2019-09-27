import NavigationService from '../services/NavigationService';

export default {
  openBrowser:  (urlParam) => {
    NavigationService.navigate('InAppBrowserComponent', {
      browserUrl: urlParam
    });
  }
};
