import { Dimensions, StyleSheet } from 'react-native';
import Colors from '../../theme/styles/Colors';

export default styles = StyleSheet.create({
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
});
