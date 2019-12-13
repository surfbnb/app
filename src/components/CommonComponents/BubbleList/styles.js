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

  bubbleSize: {
    height: 38,
    width: 38,
    borderColor: Colors.white,
    borderWidth: 1,
    borderRadius: 20
  },

  bubbleContainer: {
    flexDirection:'row',
    marginLeft: 35,
    alignItems: 'center',
    zIndex: 3
  },

  repliesTxt: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold'
  },

  emptyBubble: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: Colors.white,
    backgroundColor: Colors.wildWatermelon2
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
