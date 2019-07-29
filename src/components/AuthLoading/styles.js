import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
