import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  item: {
    fontSize: 15,
    flex: 1,
    fontFamily: 'AvenirNext-Medium',
    color: Colors.valhalla,
    marginLeft: 10
  },
  expressBtn: {
    marginRight: 15,
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  sendBtn: {
    borderRadius: 20,
    paddingLeft: 20,
    paddingRight: 20
  },
  txtWrapper: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  btnWrapper: {
    flex: 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  imageStyleSkipFont: {
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    width: 40
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
  imageIconSkipFont: {
    width: 15,
    height: 15

  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
