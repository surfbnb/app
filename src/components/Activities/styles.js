import { StyleSheet, Dimensions } from 'react-native';

export default inlineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6'
    // paddingLeft: 10,
    // paddingRight: 10
  },
  buttonContainer: {
    // height: 50,
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(159, 192, 207, 0.2)'
  },
  button: {
    width: Dimensions.get('window').width / 2 ,
    // borderLeftColor: 'red',
    // borderLeftWidth: 2,
    // height: 50,
    // alignSelf: 'center',
    alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 2
  },
  buttonView: {
    width: Dimensions.get('window').width ,
    backgroundColor: 'yellow'
  },
  buttonViewBlue: {    
    width: Dimensions.get('window').width ,
    backgroundColor: 'orange'
  }

});
