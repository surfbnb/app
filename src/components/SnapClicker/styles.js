import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  container: {
    flex: 1
  },
  previewSkipFont: {
    flex: 1,
    justifyContent: 'space-between'
  },
  captureBtn: {
    alignSelf: 'center',
  },
  imgCaptureButtonSkipFont: {
    height: 76,
    width: 76,
    marginBottom: 20
  },
  crossIconSkipFont: {
    height: 20,
    width: 20,
    marginLeft: 25,
    marginTop: 25
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
