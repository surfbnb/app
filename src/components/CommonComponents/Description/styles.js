import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from "../../../theme/styles/Colors";

let stylesMap = {
  mainWrapper : {
    padding: 15
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.valhalla
  },
  desc :{
    fontSize: 14,
    color: Colors.valhalla
  },
  more: {
    fontFamily: 'AvenirNext-DemiBold',
    color: Colors.valhalla
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
