import {Dimensions, StyleSheet} from 'react-native';

export default styles = StyleSheet.create({
  container:{
    flexDirection:'column',
    flex:1,
    padding:20,
    backgroundColor:'rgb(246,246,246)'
  },
  addMessageTextStyle:{
    color:'rgb(50,150,208)',
    fontSize:16
  },
  switchStyle:{
    flex:1,
    justifyContent:'flex-end',
    borderEndColor : '#EF5566'
  },
  bottomButtonsWrapper:{
    flexDirection:'row',
    flex:1,
    alignItems:'flex-end',
    // marginBottom:30
  },
  sendPepoBtn:{
    flex:10,
    marginRight:10
  },
  dottedBtn:{
    flex:1
  },
  modalBackDrop:{
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    alignItems:'center',
    flex: 1,
  },
  modalCloseBtnWrapper:{
    position:'absolute',
    top:50,
    borderColor:'#ffffff',
    borderWidth:1,
    borderRadius:25,
    height:40,
    width:40,
    backgroundColor:'transparent'
  },
  modalCloseBtnContent:{
    color:'#ffffff',
    textAlign:'center',
    fontSize:25,
    transform: [{ rotate: '45deg'}]
  },
  modalContentWrapper:{
    borderRadius:3,
    width: Dimensions.get('window').width-20,
    backgroundColor:'#ffffff',
    justifyContent:'center',
    padding:20,
    position: 'absolute',
    top: '50%',
    transform: [
      { translateY: - Dimensions.get('window').height * 0.25 }
    ]
  },
  modalHeader:{
    textAlign:'center',
    color: '#484848',
    fontSize: 16,
    marginBottom: 15
  }

});
