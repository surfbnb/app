import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  optionsContainer:{
    flex:1,
    flexDirection : 'row',
    padding:20,
  },
  shareIconSkipFont:{
    height : 16,
    width : 20,
  },
  moreOptionsSkipFont : {
    height: 4.5,
    width: 21
  },
  wrapperShare : {
    paddingVertical:10,
    paddingHorizontal:5
  },
  wrapperMore : {
    height: 20,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);