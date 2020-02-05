import DefaultStyleGenerator from '../../styles/DefaultStyleGenerator';
import Colors from '../../styles/Colors';

let stylesMap = {
  animatedToastView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 30,
    paddingHorizontal: 10,
    paddingVertical: 3,
    zIndex: 9999,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    height: 55,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },

  toastBoxInsideText: {
    fontSize: 15,
    zIndex: -1
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
