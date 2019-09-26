import { Linking } from 'react-native';

import InAppBrowserComponent from '../components/CommonComponents/InAppBrowser';
import NavigationService from '../services/NavigationService';

export default {
  openBrowser:  (urlParam) => {
    NavigationService.navigate('InAppBrowserComponent', {
      browserUrl: urlParam
    });
  }
};
