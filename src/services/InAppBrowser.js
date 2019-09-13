import { Linking } from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';
import Colors from '../theme/styles/Colors';

const defaultOptions = {
  // iOS Properties
  dismissButtonStyle: 'cancel',
  readerMode: false,
  animated: true,
  modalPresentationStyle: 'overFullScreen',
  modalTransitionStyle: 'coverVertical',
  modalEnabled: true,
  // Android Properties
  showTitle: true,
  enableUrlBarHiding: true,
  enableDefaultShare: true,
  forceCloseOnRedirection: false,
  animations: {
    startEnter: 'bottom_in',
    startExit: 'bottom_out',
    endEnter: 'bottom_in',
    endExit: 'bottom_out'
  }
  // Specify full animation resource identifier(package:anim/name)
  // or only resource name(in case of animation bundled with app).
};

export default {
  openBrowser: async (urlParam, optionsParam) => {
    const url = urlParam;
    const options = Object.assign({}, defaultOptions, optionsParam);
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, options);
        console.log('Opening ' + url + ' in browser', result);
      } else Linking.openURL(url);
    } catch (error) {
      console.log('Error opening ' + url + ' in browser', error);
    }
  }
};
