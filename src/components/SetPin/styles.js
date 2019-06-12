import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
container : { 
    marginTop: 25,
    flex:1,
    paddingLeft: 50, 
    paddingRight: 50, 
    fontWeight: '300' 
},
confirmPinInfoText: {
    textAlign: 'center', 
    color: 'rgb(16, 16, 16)', 
    fontSize: 15, 
    lineHeight: 22, 
    fontWeight: '300', 
    marginBottom:20
},
termsPoliciesInfoText : {
    flexDirection:'row', 
    alignSelf:'center', 
    marginBottom:5, 
    fontSize:12, 
    fontWeight:'300', 
    color: 'rgb(136, 136, 136)' 
},
termsPoliciesLinkText : {
    flexDirection:'row', 
    alignSelf:'center', 
    marginBottom:15, 
    fontSize:12, 
    fontWeight:'500', 
    color: 'rgb(136, 136, 136)' 
}

})