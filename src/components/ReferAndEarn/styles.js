import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1
  },
  heading: {
    color: Colors.valhalla,
    fontSize: 20,
    marginBottom: 10
  },
  content: {
    color: 'rgba(42, 41, 59, 0.7)',
    lineHeight: 20,
    textAlign: 'center'
  },
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 25,
    padding: 30
  },
  topWrapper: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    backgroundColor: Colors.white,
    borderRadius: 7,
    marginBottom: 0,
    position: 'relative',
    padding: 0
  },
  inviteCode: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 3,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-DemiBold'
  },
  bottomWrapper: {
    margin: 25,
    marginTop: 0
  },
  middleWrapper: {
    margin: 25
  },
  arrowImageSkipFont: {
    width: 25,
    height: 22,
    position: 'absolute',
    top: 10,
    right: 10
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
