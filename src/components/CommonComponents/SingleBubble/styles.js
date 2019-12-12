import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

  bubbleShadow: {
    // shadowColor: Colors.white,
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.8,
    // shadowRadius: 5,
    // elevation: 3,
    // borderColor: Colors.white,
    // borderWidth: 2,
    // borderRadius: 20
  },

  bubbleSizeSkipFont: {
    height: 40,
    width: 40,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20
  },

  bubbleContainer: {
    flexDirection:'row',
    marginLeft: -45,
    alignItems: 'center'
  },

  repliesTxt: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold'
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
