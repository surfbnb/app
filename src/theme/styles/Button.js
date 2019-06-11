import DefaultStyleGenerator from './DefaultStyleGenerator';

let styles = {
  btn: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
    // marginTop: 15
  },
  btnText: {
    fontSize: 15,
    textAlign: 'center'
  },
  btnPrimary: {
    backgroundColor: 'rgb(22,141,193)',
    borderColor: 'rgb(22,141,193)'
  },
  btnPrimaryText: {
    color: 'rgb(255, 255, 255)',
  },
  btnSecondary: {
    backgroundColor: '#ffffff',
    borderColor: 'rgb(22,141,193)'
  },
  btnSecondaryText: {
    color: 'rgb(22,141,193)'
  },
  disabled: {
    opacity: 0.5
  }
};



export default (Buttons = DefaultStyleGenerator.generate(styles));
