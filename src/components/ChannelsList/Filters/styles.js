import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {

  btnStyle: {
    borderRadius: 20,
    paddingVertical: 5,
    alignItems: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 5,
    marginTop: 10,
    flexDirection: 'row'
  },

  textStyle : {
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    marginLeft:4
  },

  filterBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary
  },

  filterBtnSelected: {
    backgroundColor: Colors.primary
  },

  createNewBtn: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.pinkRed
  },

  filterBtnText: {
    color: Colors.primary
  },

  filterBtnSelectedText: {
    color: Colors.white
  },

  createNewBtnText: {
    color: Colors.pinkRed
  },

  filterBtnImage: {
    width: 10,
    height: 10.66
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
