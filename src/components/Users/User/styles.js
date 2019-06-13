import { StyleSheet } from 'react-native';

export default inlineStyles = StyleSheet.create({
  item: {
    fontSize: 15,
    flex: 1,
    fontWeight: 'bold'
  },
  expressBtn: {
    marginRight: 15,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  sendBtn: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  userContainer: {
    padding: 10,
    flexDirection: 'row',
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: 'rgb(233,233,233)',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  },
  txtWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
});
