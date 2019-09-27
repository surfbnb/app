import DefaultStyleGenerator from "../../styles/DefaultStyleGenerator";

let stylesMap = {
  backgroundStyle: {
    backgroundColor: 'rgba(0,0,0,0.75)',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    height: '100%'
  },
  loadingImage: {
    width: 82,
    height: 52,
    marginBottom: 20
  },
  loadingMessage: {
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 15,
    color: 'white',
    fontWeight: '500'
  },
  footerText: {
    position: 'absolute',
    bottom: 20,
    textAlign: 'center',
    color: '#fff',
    fontSize: 14
  },

  alertImage: {
    width: 40,
    height:40,
    resizeMode: 'contain'
  },
  alertMessage: {
    textAlign: 'center',
    fontSize: 18,
    margin: 15,
    marginBottom: 4,
    color: 'white',
    fontWeight: '500'
  },
  alertFooter: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
