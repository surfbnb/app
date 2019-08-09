import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
  topBg: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderTopLeftRadius: 23,
    borderBottomLeftRadius: 23,
    zIndex: 1,
    position: 'absolute',
    top: 50,
    right: 0
  },
  innerTopBg:{
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  topBgTxt: {
    color: '#2a293b',
    fontSize: 14,
    marginLeft: 6,
    alignSelf: 'center',
    fontFamily: 'AvenirNext-DemiBold'
  },
  crossIconClickSpace: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center'
  },
  topUp: {
    color: '#ff5566',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 14
  },
  crossIconSkipFont: {
    width: 13,
    height: 12.6
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
