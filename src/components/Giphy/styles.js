import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    fontWeight: '300',
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  modal: {
    position: 'absolute',
    top: 30,
    marginTop: 50
  },
  giphyPicker: {
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: '#afafaf',
    borderStyle: 'dashed',
    // margin: 20,
    padding: 20,
  },
  plusIcon: {
    width: 42,
    height: 42,
    alignSelf: 'center'
  },
  giphyPickerText: {
    textAlign: 'center',
    color: '#ababab',
    fontSize: 20,
    fontWeight: '300',
    marginTop: 10
  },
  termsPoliciesInfoText: {
    alignSelf: 'center',
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '300',
    color: 'rgb(136, 136, 136)'
  },
  termsPoliciesLinkText: {
    alignSelf: 'center',
    marginBottom: 15,
    fontSize: 12,
    color: '#3296d0'
  }
});
