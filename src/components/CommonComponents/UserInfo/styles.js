import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
  infoHeaderWrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    width: Dimensions.get('window').width - 40,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: Colors.black,
    shadowOpacity: 0.2,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0},
    elevation: 5,
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginBottom: 20
  },
  userProfileImageSkipFont: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: Colors.gainsboro
  },
  userName: {
    color: Colors.valhalla,
    marginRight: 8,
    fontFamily: 'AvenirNext-DemiBold'
  },
  bioSection: {
    color: Colors.valhalla,
    fontSize: 14
  },
  bioSectionWrapper: {
    marginTop: 20,
    marginHorizontal: 30,
    textAlign: 'center'
  },
  numericInfoWrapper: {
    marginTop: 20,
    flexDirection: 'row',
    width: Dimensions.get('window').width - 30
  },
  numericInnerWrapper:{
    // borderLeftWidth: 1,
    // borderColor: '#ff5566',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 15,
    color: Colors.valhalla,
    flex: 1
  },
  numericInfoTextBold: {
    fontFamily: 'AvenirNext-DemiBold'
  },
  numericInfoText: {
    fontSize: 14,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Regular'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
