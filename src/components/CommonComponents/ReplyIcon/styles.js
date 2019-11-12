import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

   replyIconWrapper : {
      marginBottom: 5,
      height: 50,
      width: 50, 
      alignItems: 'center', 
      justifyContent: 'center'
   },
   videoReplyCount : {
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    fontFamily: 'AvenirNext-DemiBold'
   }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
