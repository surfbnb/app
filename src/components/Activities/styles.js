import { StyleSheet, Dimensions } from 'react-native';

export default inlineStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6'
    // paddingLeft: 10,
    // paddingRight: 10
  },
  buttonContainer: {        
    alignItems: 'center',
    justifyContent: 'center',
    height: 44,
    // backgroundColor: '#FFB6C1',    
    flexDirection: 'row'    
  },
  button: {     
    width: Dimensions.get('window').width / 2,
    borderLeftColor: 'red',
    borderLeftWidth: 2,
    height: '100%'

    
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
