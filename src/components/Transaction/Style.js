import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import { Dimensions, Platform } from 'react-native';
import Colors from '../../theme/styles/Colors';
import { ifIphoneX, getBottomSpace } from 'react-native-iphone-x-helper';

let stylesMap = {
  container: {
    backgroundColor: Colors.white,
    alignSelf: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    // ...ifIphoneX(
    //   {
    //     bottom: getBottomSpace([true])
    //   },
    //   {
    //     bottom: 0
    //   }
    // )
    bottom: 0
  },
  headerWrapper: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: Colors.seaMist,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  modalHeader: {
    textAlign: 'center',
    color: Colors.valhalla,
    fontSize: 16,
    paddingVertical: 5
  },
  editableTextInput: {
    marginLeft: 10,
    textAlign: 'center',
    paddingLeft: 0,
    paddingRight: 0
  },
  crossIconWrapper: {
    position: 'absolute',
    left: 5,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  crossIconSkipFont: { width: 13, height: 12.6 }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
