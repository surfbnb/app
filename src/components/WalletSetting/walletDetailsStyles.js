import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {

  list: {
    flex: 1,
  },
  title: {
    color: Colors.grey,
    fontSize: 14,
    marginTop: 15,
    fontFamily: 'AvenirNext-DemiBold'
  },
  text: {
    color: Colors.valhalla,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'AvenirNext-Regular'
  },

  statusText: {
    color: Colors.green,
    fontSize: 16,
    marginTop: 5,
    marginBottom: 15,
    fontFamily: 'AvenirNext-Regular'
  },

  linkView: {
    marginTop: 5,
    flex: 2,
    marginRight: 0,
  },

  linkText: {
    color: Colors.azureBlue,
    marginBottom: 15,
    fontSize: 16,
    flexWrap: 'wrap',
    fontFamily: 'AvenirNext-Regular'
  },

  listComponent: {
    flex: 1,
    marginHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.whisper
  }
};
export default styles = DefaultStyleGenerator.generate(stylesMap);

