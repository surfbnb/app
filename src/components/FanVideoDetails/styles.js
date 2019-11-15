import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions } from 'react-native';
import { Header } from 'react-navigation-stack';

import { getStatusBarHeight, getBottomSpace, isIphoneX } from 'react-native-iphone-x-helper';

const safeAreaHeight = getStatusBarHeight() + getBottomSpace([true]);

let stylesMap = {
  container: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'space-between',
    height: Dimensions.get('window').height - safeAreaHeight - Header.HEIGHT - 55
  },
  posterImageSkipFont: {
    aspectRatio: 3 / 4,
    height: 100,
    justifyContent: 'center'
  },
  playIconSkipFont: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
  videoDescriptionItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccd3cd',
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  videoLinkItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccd3cd',
    paddingBottom: 16,
    alignItems: 'center',
    paddingHorizontal: 12,
    zIndex: -1
  },
  videoAmountItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccd3cd',

    alignItems: 'center',
    paddingBottom: 16,
    paddingHorizontal: 12,
    zIndex: -1

  },
  videoDescription: {
    color: 'rgba(42, 41, 59, 0.8)',
    // flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'AvenirNext-Regular',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    fontWeight: '300',
    marginLeft: 10,
    marginTop: 0,
    padding: 0,
    paddingTop: 0,
    position: 'relative',
    paddingLeft: 0,
    height: 100
  },
  dropDownStyle: {
    marginLeft: -90,
    width: Dimensions.get('window').width,
    shadowColor: '#000',
    shadowOffset: { width: -1, height: 1 },
    shadowOpacity: 0.2,
    elevation: 1
  },
  linkText: { color: Colors.softBlue, flex: 3},
  replyAmtWrapper : {
    flex:1,
    flexDirection:"row",
    justifyContent:'space-between',
    alignItems:'center'
  },
  errorStyle: {
    width: 0,
    flex: 0,
    height: 0
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
