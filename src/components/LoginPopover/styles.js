import {Dimensions, Text} from 'react-native';
import Colors from '../../theme/styles/Colors';
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import React from "react";

let stylesMap = {
  parent: {
    flex: 1
  },
  container: {
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Dimensions.get('window').height / 2.3,
    paddingTop: 40,
    paddingBottom: 30,
    position: 'absolute',
    width: '100%',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    bottom: 0,
    zIndex: 9
  },
  welcomeBack:{
    minHeight: Dimensions.get('window').height / 3,
  },
  crossTouchable:{
    position: 'absolute',
    top: 15,
    right: 15,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  crossIconSkipFont:{
    height: 19,
    width: 19.5
  },
  crossBtnPos: {
    position: 'absolute',
    top: 10,
    right: 15,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center'
  },
  loginBtnStyles:{
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
    padding: 10,
    borderColor: 'rgba(42, 41, 59, 0.3)'
  },
  loginBtnTextStyles:{
    fontSize: 16,
    color: '#2a293b',
    fontFamily: 'AvenirNext-Regular'
  },
  desc: {
    color: Colors.dark,
    fontSize: 16,
    textAlign: 'center',
    width: '95%'
  },
  tocPp: {
    width: '85%',
    marginTop: 24
  },
  termsTextBlack: {
    lineHeight: 24,
    color: Colors.dark
  },
  termsTextBlue: {
    lineHeight: 24,
    color: Colors.softBlue
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);