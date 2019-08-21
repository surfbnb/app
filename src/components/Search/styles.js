import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

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
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
