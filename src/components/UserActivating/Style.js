import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50
  },
  title: {
    color: Colors.wildWatermelon,
    fontSize: 26,
    letterSpacing: -0.3
  },
  subTitle: {
    color: Colors.black,
    fontSize: 20,
    marginTop: 10
  },
  coinsCount: {
    color: Colors.wildWatermelon,
    fontSize: 20,
    marginTop: 5
  },
  descTxt: {
    color: Colors.black,
    fontSize: 18
  },
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
