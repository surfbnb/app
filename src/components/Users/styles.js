import { StyleSheet, Dimensions } from 'react-native';

export default inlineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6'
  },
  buttonContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(159, 192, 207, 0.2)',
    height: 60,
    paddingVertical: 15

  },
  button: {     
    width: Dimensions.get('window').width / 2,
    height: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2
  },
  bottomSliderStyle: {
    width: Dimensions.get('window').width / 2,    
    height:1,
    backgroundColor: '#ef5869'
  }

});
