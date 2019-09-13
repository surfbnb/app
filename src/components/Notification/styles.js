import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  item: {    
    marginLeft: 4,
    marginRight: 4,
    flexDirection: 'row',
    flexWrap: 'wrap'
  },

  txtWrapper: {
    flex: 1,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 12,
    paddingLeft: 12,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  },
  imageStyleSkipFont: {
    marginRight: 10,
    borderRadius: 20,
    height: 40,
    width: 40
  },

  numericInnerWrapper: {
    marginHorizontal: 6,
    justifyContent: 'center',
    color: Colors.white,
    flexDirection: 'row'
  },
  numericInfoText: {
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-DemiBold',
    marginLeft: 3
  },
  imageIconSkipFont: {
    width: 12,
    height: 12,
    marginTop: 2
  },
  timeStamp: {
    color: Colors.darkGray2,
    fontFamily: 'AvenirNext-Regular',
    fontSize: 14,
    marginLeft: 5,
    letterSpacing: -0.68    
  },

  posterImageSkipFont: {
    aspectRatio: 3 / 4,
    width: 40,
    marginLeft: 'auto',
    justifyContent: 'center'
  },
  playIconSkipFont: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
  sayThanksButton: {
    width: 120,
    height: 35,
    borderRadius: 20,
    borderWidth: 1,
    marginLeft: 50,
    marginBottom: 10,
    marginTop: 2,
    borderColor: Colors.rhino,
    justifyContent: 'center'
  },
  sayThanksText: {
    alignSelf: 'center',
    color: Colors.rhino,
    fontFamily: 'AvenirNext-Medium'
  },
  systemNotificationIconSkipFont: {
    height: 30,
    width: 30,
    borderRadius: 15
  },
  sectionHeaderTitle: {
    color: '#34445b',
    fontFamily: 'AvenirNext-DemiBold',
    fontSize: 18,
    fontWeight: '600'
  },

  sectionHeaderView: {
    borderTopColor: '#eee',
    borderTopWidth: 1,
    marginHorizontal: 15,
    paddingTop: 15
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
