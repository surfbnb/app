import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.snow
  },

  imgSize: {
    width: 68.5,
    height: 68.5
  },

  desc:{
    fontSize: 22,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 25,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Regular'
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
