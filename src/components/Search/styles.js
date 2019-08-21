import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from "../../theme/styles/Colors";

let stylesMap = {
  container: {
    flex: 1,
    padding: 20
  },
  textInputUi:{
    marginTop: 0,
    borderWidth: 0,
    paddingLeft: 40,
    paddingRight: 35,
    backgroundColor: 'rgba(204, 211, 205, 0.2)'
  },
  searchIconSkipFont:{
    width: 30,
    height: 30
  },
  crossIconSkipFont:{
    height: 15,
    width: 15,
  },
  iconsPos: {
    position: 'absolute',
    height: 46,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  txtWrapper: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  systemNotificationIconSkipFont: {
    height: 50,
    width: 50,
    borderRadius: 15,
    marginRight: 10
  },
  titleName: {
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16
  },
  titleHandle: {
    color: 'rgba(42, 41, 59, 0.6);',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
