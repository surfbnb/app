import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
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
    bottom: 0
    // ...ifIphoneX(
    //   {
    //     bottom: getBottomSpace([true])
    //   },
    //   {
    //     bottom: 0
    //   }
    // )
  },
  headerWrapper: {
    backgroundColor: Colors.white,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    flexDirection: 'row',    
    paddingHorizontal: 10,
    paddingVertical: 20,
    
    position: 'relative'
  },
  modalHeader: {
    //textAlign: 'center',
    color: Colors.valhalla,
    fontSize: 16,
    paddingVertical: 5,
    marginLeft: 10
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
