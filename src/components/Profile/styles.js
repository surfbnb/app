import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  pepoBalance: {
    fontSize: 16,
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-DemiBold'
  },
  usdBalance: {
    fontSize: 14,
    color: Colors.wildWatermelon2
  },
  redeemBalance: {
    fontSize: 12,
    color: Colors.valhalla,
    fontFamily: 'AvenirNext-Regular'
  },
  balanceLabel: {
    fontSize: 16,
    color: Colors.wildWatermelon2,
    fontFamily: 'AvenirNext-Regular'
  },
  editProfileContainer: {
    height: 75,
    width: 75,
    position: 'relative',
    marginBottom: 20
  },
  editProfileIconTouch: {
    height: 50,
    width: 50,
    position: 'absolute',
    right: -15,
    bottom: -13,
    justifyContent: 'center',
    alignItems: 'center'
  },
  editProfileIconPos: {
    width: 26,
    height: 26,
    justifyContent: 'center',
    alignItems: 'center',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors.wildWatermelon,
    backgroundColor: Colors.white
  },

  profileEditIconSkipFont: {
    height: 75,
    width: 75,
    borderRadius: 37.5
  },
  accessText: {
    fontSize: 18,
    color: Colors.azureBlue,
    textAlign: 'center'
  },
  accessTextDesc: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500',
    marginVertical: 20
  },
  imageDimSkipFont: {
    height: 40,
    width: 50
  },
  accessAllowContent: {
    alignItems: 'center',
    flex: 1,
    marginTop: '25%',
    marginHorizontal: 30
  },
  crossIconDimSkipFont: {
    height: 10,
    width: 10
  },
  crossIconWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 20
  },
  allowAccessheader: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: Colors.lightGrey,
    borderBottomWidth: 1,
    flexDirection: 'row',
    width: '100%',
    height: 50
  },
  headerText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '500'
  },
  bannerContainer : {
    backgroundColor: '#ff5566',
    textAlign: 'center',
    width: '100%',
    paddingVertical: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  infoImageDimensions : {
    height: 19.3,
    width: 18.6
  },
  infoText : {
    color: Colors.white,
    textAlign: 'center',
    marginLeft: 4
  },
  headerStyle: {
    fontWeight: '600',
    fontSize: 17,
    color: 'rgba(0,0,0,.9)'
  },
  clickWrapper :{
    zIndex: 10,
    position: "absolute",
    top:0,
    right: 0,
    width:'100%'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
