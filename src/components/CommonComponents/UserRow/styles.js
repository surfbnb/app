import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  txtWrapper: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center' 
  },
  outerWrapper:{
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  innerViewWrapper : {
    flexDirection: 'column', 
    paddingLeft: 15,
  },
  titleName: {
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Medium',
    fontSize: 16
  },
  titleHandle: {
    color: 'rgba(42, 41, 59, 0.6);',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 15
  },
  smallHandleTitle: {
    color: 'rgba(42, 41, 59, 0.6);',
    fontFamily: 'AvenirNext-Medium',
    fontSize: 13
  },
  adminLeafInnerWrapper: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginLeft: 'auto',
    height: 35,
    minWidth: 80,
    justifyContent: 'center',
    borderColor: Colors.wildWatermelon2
  },
  adminLeafInnerText: {
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-DemiBold'
  },
  supportersSupportingWrapper: {
    fontSize: 15,
    flex: 1,
    fontFamily: 'AvenirNext-Medium',
    color: Colors.valhalla,
    marginLeft: 10
  },
  numericInnerWrapper: {
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    marginLeft: 'auto',
    paddingHorizontal: 12,
    height: 32,
    justifyContent: 'center',
    color: Colors.white,
    borderColor: Colors.wildWatermelon2,
    flexDirection: 'row'
  },
  numericInfoText: {
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-DemiBold',
    marginLeft: 8
  },
  pepoAmountimageIconSkipFont: {
    width: 15,
    height: 15
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
