import { StyleSheet , Dimensions } from 'react-native';
import PropTypes from 'prop-types';

export default styles = StyleSheet.create({
  container: {
    flex: 0,
    height:70,
    flexDirection: 'row',
    justifyContent: 'space-around',
    position:'relative',
    backgroundColor :"#ffffff",
    alignItems: 'flex-end',
    borderTopWidth: 2,
    borderTopColor: 'rgb(233,233,233)',  
    paddingBottom : 10
  },
  tabElement:{
    alignSelf:'center',
    paddingBottom : 10
  },
  overlayBtn:{
      position: 'absolute',
      left: (Dimensions.get('window').width / 2) - 27,
      top:-20,
      borderColor:'rgb(233,233,233)',
      backgroundColor:'rgb(233,233,233)',
      height:55,
      width:55,
      borderWidth:2,
      borderRadius:50
  },
});
