import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

  bubbleShadow: {
    shadowColor: Colors.wildWatermelon2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 3,
    borderColor: Colors.wildWatermelon2,
    borderWidth: .5,
    borderRadius: 20
  },

  bubbleSizeSkipFont: {
    height: 38,
    width: 38,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 20
  },

  bubbleContainer: {
    flexDirection:'row',
    marginLeft: 30,
    alignItems: 'center'
  },

  repliesTxt: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold'
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
