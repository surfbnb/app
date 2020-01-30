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
    height:4,
    width:20,
  },
  wrapperShare : {
    paddingVertical:10,
    paddingHorizontal:5
  },
  wrapperMore : {
    paddingHorizontal:5,
    paddingVertical:10,
    marginRight:13,
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);