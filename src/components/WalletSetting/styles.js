import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {

  list: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingTop: 15
  },
  title: {
    color: Colors.valhalla,
    fontSize: 18,
    marginTop: 15,
    fontFamily: 'AvenirNext-Regular'
  },
  subtitle: {
    color: Colors.valhalla,
    fontSize: 12,
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'AvenirNext-Regular'
  },
  listComponent: {
    flex: 1,
    marginLeft: 20,
    marginRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whisper
  }
};
export default styles = DefaultStyleGenerator.generate(stylesMap);

