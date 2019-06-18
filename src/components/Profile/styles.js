import { StyleSheet } from 'react-native';
import Colors from '../../theme/styles/Colors'

export default (styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  link: {
    color: 'rgb(22,141,193)',
    fontSize: 20
  },
  balanceHeaderContainer:{
    flex:1,
    backgroundColor:Colors.whiteSmoke,
    justifyContent: 'center',
    paddingHorizontal:20,
    paddingTop:20,

  },
  balanceHeader:{
    borderRadius:10,
    paddingVertical:10,
    backgroundColor : Colors.primary,
    alignItems:'center',
  },
  balanceToptext:{
    fontSize:11,
    color:Colors.white,
    fontWeight:'500'
  },
  pepoBalance:{
    fontSize:28,
    color:Colors.white,
    fontWeight:'800'
  },
  usdBalance:{
    fontSize:16,
    color:Colors.white,
    fontWeight:'500'
  }

}));
