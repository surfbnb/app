import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";

let stylesMap = {
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  form: {
    width: 300
  },
  title: {
    fontSize: 24,
    margin: 10,
    textAlign: 'center'
  },
  label: {
    textAlign: 'center',
    color: 'rgb(136,136,136)',
    fontSize: 13,
    marginBottom: 8
  },
  link: {
    textAlign: 'center',
    color: 'rgb(22,141,193)',
    fontSize: 15,
    fontWeight: '400'
  },
  error: {
    textAlign: 'center',
    color: '#de350b',
    fontSize: 12,
    marginBottom: 6
  },
  imgPepoLogoSkipFont: {
    height: 70,
    width: 150,
    marginBottom: 20,
    alignSelf: 'center'
  },
  bottomBtnAndTxt: {
    height: 65
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
