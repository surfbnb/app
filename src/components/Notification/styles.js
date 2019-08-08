import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  item: {
    // fontSize: 15,
    // flex: 1,
    // fontWeight: '300',
    //color: Colors.midNightblue,
    marginHorizontal: 10,
    flexDirection: 'row'
  },

  txtWrapper: {
    flex: 1,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  imageStyleSkipFont: {
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    width: 40
  },

  numericInnerWrapper: {
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    // borderColor: '#fff',
    // alignItems: 'flex-start',
    width: 80,
    paddingLeft: 10,
    justifyContent: 'center',
    paddingVertical: 10,
    color: Colors.white,
    borderColor: Colors.pinkRed,
    flexDirection: 'row',
    right: 10,
    position: 'absolute'
    // flex: 0.5
  },
  numericInfoText: {
    color: Colors.pinkRed,
    fontFamily: 'AvenirNext-DemiBold',
    marginLeft: 5
  },
  imageIconSkipFont: {
    width: 15,
    height: 15
  },
  timeStamp: {
    color: '#b1b1b1',
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    //font-weight: normal;
    // height: 38,
    letterSpacing: -0.68,
    width: 32
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
