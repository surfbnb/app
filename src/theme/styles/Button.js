import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';

let styles = {
  btn: {
    borderRadius: 6,
    borderWidth: 1,
    padding: 12
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
    fontFamily: 'Lato-Bold'
  },
  btnSecondary: {
    backgroundColor: Colors.white,
    borderColor: 'rgb(22,141,193)'
  },
  btnSecondaryText: {
    color: 'rgb(22,141,193)'
  },
  disabled: {
    opacity: 0.5
  },
  btnPink: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary
  },
  btnPinkText: {
    color: Colors.white
  }
};

export default Buttons = DefaultStyleGenerator.generate(styles);
