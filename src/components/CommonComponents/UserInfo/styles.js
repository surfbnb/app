import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
  infoHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  userProfileImageSkipFont: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: Colors.gainsboro
  },
  userName: {
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-DemiBold',
    marginTop: 10
  },
  bioSection: {
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
    color: Colors.valhalla,
  },
  numericInfoWrapper: {
    flexDirection: 'row',
    width: Dimensions.get('window').width - 40
  },
  numericInnerWrapper:{
    borderTopLeftRadius: 15,
    borderLeftWidth: 1,
    borderColor: '#fff',
    alignItems: 'flex-start',
    justifyContent: 'center',
    padding: 15,
    color: Colors.white
  },
  numericInfoText: {
    color: Colors.white,
    fontFamily: 'AvenirNext-DemiBold'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
