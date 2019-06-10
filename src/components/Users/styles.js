import { StyleSheet } from 'react-native';

export default (inlineStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 22,
    paddingLeft: 10,
    paddingRight: 10
  },
  item: {
    fontSize: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(233,233,233)',
    paddingTop: 20,
    padding: 10
  }
}));
