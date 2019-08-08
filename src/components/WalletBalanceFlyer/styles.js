import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  topBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 60,
    height: 46,
    borderTopLeftRadius: 23,
    borderBottomLeftRadius: 23,
    zIndex: 1,
    position: 'absolute',
    top: 50,
    right: 0
  },
  topBgTxt: {
    color: '#2a293b',
    fontSize: 14,
    marginLeft: 6,
    fontFamily: 'AvenirNext-DemiBold'
  },
  crossIcon: {
    // marginLeft: 10,
    width: 13,
    height: 12.6,
    // alignSelf: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
