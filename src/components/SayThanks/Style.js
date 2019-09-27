import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

let stylesMap = {
  container: {
    backgroundColor: Colors.white,
    alignSelf: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    paddingHorizontal: 15,
    paddingTop: 15,
    bottom: 0
  },


  backgroundStyle: {
    backgroundColor: 'white',
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom:0,
    right:0,
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    opacity: 0.8
  },


  headerWrapper: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  modalHeader: {
    color: Colors.midNightblue,
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 16,
    paddingVertical: 5,
    marginLeft: 10
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
