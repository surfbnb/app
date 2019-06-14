import { StyleSheet, Dimensions } from 'react-native';

export default styles = StyleSheet.create({
  container: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 40,
    fontWeight: '300',
    alignItems: 'stretch',
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  modalInner: {
    backgroundColor: '#ffffff',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    padding: 20,
    paddingTop: 10,
    position: 'absolute',
    bottom: 0,
    height: Dimensions.get('window').height * 0.9
  },
  giphyPicker: {
    marginBottom: 20,
    borderWidth: 1,
    backgroundColor: '#ffffff',
    borderColor: '#afafaf',
    borderStyle: 'dashed',
    padding: 20
  },
  overlay: {
    position: 'absolute',
    margin: 3,
    borderRadius: 4,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    fontFamily: 'Lato-Bold',
    fontWeight: '700'
  },
  overlayText: {
    color: '#fff',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
    fontFamily: 'Lato-Bold',
    fontWeight: '700'
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
