import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  } //,
  // smoothPinCodeInput : {
  //   marginTop: -10,
  //   marginLeft: -1
  // },
  // ios: {
  //   smoothPinCodeInput : {
  //     marginTop: -10,
  //     marginLeft: -1
  //   }
  // },
  // android: {
  //   smoothPinCodeInput: {
  //     marginTop: -5,
  //     marginLeft: -2.5
  //   }
  // }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
