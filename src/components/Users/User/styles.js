import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  item: {
    fontSize: 15,
    flex: 1,
    fontWeight: '300',
    color: Colors.midnightblue,
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

  numericInnerWrapper:{
    borderTopLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderWidth: 1,
    // borderColor: '#fff',
    alignItems: 'flex-start',
    width: 100,
    paddingLeft: 10,
    justifyContent: 'center',
    paddingVertical: 10,
    color: Colors.white,
    borderColor: Colors.pinkRed,
    flexDirection: 'row'
    // flex: 0.5    
  },
  numericInfoText: {
    color: Colors.pinkRed,
    fontFamily: 'AvenirNext-DemiBold',
    marginLeft: 8
  },
  imageIconSkipFont: {
    width: 15,
    height: 15

  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
