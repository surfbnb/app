import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
  balanceHeaderContainer: {
    flex: 1,
    backgroundColor: Colors.whiteSmoke,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20
  },
  balanceHeader: {
    borderRadius: 10,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    alignItems: 'center'
  },
  balanceToptext: {
    fontSize: 11,
    color: Colors.white,
    fontWeight: '500'
  },
  pepoBalance: {
    fontSize: 18,
    color: Colors.white,
    fontWeight: '300'
  },
  usdBalance: {
    fontSize: 16,
    color: Colors.white,
    fontWeight: '500'
  },
  infoHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  },
  profileImageSkipFont: {
    height: 25,
    width: 25,
    borderRadius: 12.5,
    backgroundColor: Colors.gainsboro
  },
  userName: {
    fontWeight: 'bold',
    color: Colors.dark,
    marginLeft: 5
  },
  bioSection: {
    textAlign: 'center',
    marginVertical: 10,
    color: Colors.greyLite,
    fontWeight: 'normal'
  },
  numericInfoWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15
  },
  numericInfo: {
    color: Colors.dark,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  numericInfoText: {
    color: Colors.greyLite,
    fontWeight: 'normal'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
