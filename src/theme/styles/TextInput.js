import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';
import { Platform } from 'react-native';

let styles = {
  textInputStyle: {
    borderColor: Colors.light,
    borderWidth: 1,
    borderRadius: 6,
    fontSize: 17,
    fontWeight: '300',
    padding: 5,
    paddingLeft: 15,
    marginTop: 10,
    color: Colors.dark,
    height: Platform.OS === 'ios' ? 46 : 46
  }
};

export default TextInput = DefaultStyleGenerator.generate(styles);
