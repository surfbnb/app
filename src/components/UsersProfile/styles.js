import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.snow
  },

  imgSizeSkipFont: {
    width: 68.5,
    height: 68.5
  },

  desc:{
    fontSize: 22,
    marginTop: 10,
    textAlign: 'center',
    paddingHorizontal: 25,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Regular'
  },
  userProfileOptionSkipFont : {
    height:4,
    width:20,
    marginRight:20
  },
  reportIconWrapper: {
    height: 24,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  shareIconSkipFont:{
    height : 16,
    width : 20,
    marginRight:8
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
