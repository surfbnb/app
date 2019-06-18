import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flexDirection: 'column',
    flex: 1,
    padding: 20,
    backgroundColor: Colors.whiteSmoke
  },
  cellWrapper: {
    // marginBottom: 20,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.light,
    borderRadius: 10,
    padding: 20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
