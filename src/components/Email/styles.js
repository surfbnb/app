import Colors from '../../theme/styles/Colors';
import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginVertical: 20,
    marginHorizontal: 10
  },
  resend: {
    color: Colors.valhalla,
    borderColor: Colors.wildWatermelon2,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 15
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
