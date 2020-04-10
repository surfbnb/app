import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

  wrapper: {
    paddingHorizontal: 10,
    height: 40,
    alignItems: 'center'
  },

  btnStyle: {
    borderRadius: 13,
    alignItems: 'center',
    fontSize: 0,
    height: 26,
    justifyContent: 'center',
    paddingHorizontal: 10,
    marginHorizontal: 5
  },

  textStyle : {
    fontFamily: 'AvenirNext-Medium',
    fontSize: 12
  },

  filterBtn: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.valhalla
  },

  filterBtnSelected: {
    backgroundColor: Colors.primary
  },

  filterBtnText: {
    color: Colors.valhalla,
    fontSize: 12
  },

  filterBtnSelectedText: {
    color: Colors.white,
    fontSize: 12
  },

  filterBtnImage: {
    width: 10,
    height: 10.66
  },

  createNewBtn: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.pinkRed,
    flexDirection:'row'
  },

  createNewBtnText: {
    color: Colors.pinkRed,
    fontFamily: 'AvenirNext-Medium',
    fontSize: 12,
    marginLeft:3
  },
  addIconSkipFont:{
    height:11,
    width:11

  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
