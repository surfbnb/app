import { Dimensions } from 'react-native';
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    backgroundColor: Colors.whiteSmoke
  },
  buttonContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(159, 192, 207, 0.2)',
    height: 60,
    paddingVertical: 15

  },
  button: {     
    width: Dimensions.get('window').width / 2,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2
  },
  bottomSliderStyle: {
    width: Dimensions.get('window').width / 2,    
    height:1,
    backgroundColor: Colors.pinkRed
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
