import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
  // balanceHeaderContainer: {
  //   flex: 1,
  //   backgroundColor: Colors.whiteSmoke,
  //   justifyContent: 'center',
  //   paddingHorizontal: 20,
  //   paddingTop: 20
  // },
  // balanceHeader: {
  //   borderRadius: 10,
  //   paddingVertical: 10,
  //   backgroundColor: Colors.primary,
  //   alignItems: 'center'
  // },
  // balanceToptext: {
  //   fontSize: 11,
  //   color: Colors.white,
  //   fontWeight: '500'
  // },
  // pepoBalance: {
  //   fontSize: 18,
  //   color: Colors.white,
  //   fontWeight: '300'
  // },
  // usdBalance: {
  //   fontSize: 16,
  //   color: Colors.white,
  //   fontWeight: '500'
  // },
  infoHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // alignItems: 'center',
    width: '100%'
    // marginVertical: 10
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
  // numericInfo: {
  //   color: Colors.white
  // },
  numericInnerWrapper:{
    borderTopLeftRadius: 15,
    borderLeftWidth: 1,
    borderColor: '#fff',
    alignItems: 'flex-start',
    paddingLeft: 20,
    justifyContent: 'center',
    paddingVertical: 15,
    color: Colors.white,
    flex: 1
  },
  numericInfoText: {
    color: Colors.white,
    fontFamily: 'AvenirNext-DemiBold'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
