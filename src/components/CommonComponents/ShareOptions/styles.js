import DefaultStyleGenerator from "../../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  wrapperShare : {
    paddingVertical:10,
    paddingHorizontal:5
  },
  shareIconSkipFont:{
    height : 16,
    width : 20,
  },
}
export default styles = DefaultStyleGenerator.generate(stylesMap);