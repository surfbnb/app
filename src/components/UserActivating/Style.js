import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center'
  },
  desc: {
    color: Colors.valhalla,
    fontSize: 18,
    fontWeight: '500'
  },
  contentContainer: {
    alignItems: 'center',
    flex: 4,
    justifyContent: 'center',
    marginHorizontal: 30
  },
  heading: {
    fontSize: 24,
    fontWeight: '600',
    letterSpacing: 1.5,
    marginVertical: 20,
    fontFamily: 'AvenirNext-DemiBold'
  },
  valueContainer: {
    minWidth: '100%',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomRightRadius: 5,
    backgroundColor: 'rgba(255, 231, 240, 0.3)',
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
