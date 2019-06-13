import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    marginTop: 25,
    paddingLeft: 50,
    paddingRight: 50,
    fontWeight: '300',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  modal: {
    position: 'absolute',
    top: 30,
    marginTop: 50
  },
  giphyPicker: {
    color: '#848484',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '300',
    marginBottom: 20,
    borderWidth: 1,
    borderStyle: 'dotted'
  },
  giphyPickerText: {
    textAlign: 'center'
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
