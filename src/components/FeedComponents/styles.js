import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    // flexDirection: 'column',
    // flex: 1,
    // padding: 20,
    paddingHorizontal: 15,
    backgroundColor: Colors.whiteSmoke
  },
  cellWrapper: {
    // marginBottom: 20,
    borderWidth: 0.2,
    backgroundColor: Colors.white,
    borderColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 6,
    padding: 15,
    marginVertical: 20,
    marginBottom: 5
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
