import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  header: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 20,
    letterSpacing: 0.5
  },

  channelDesc: {
    color: Colors.white,
    letterSpacing: 0.2,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    minHeight: 40,
    marginTop: 2
  },

  channelCellWrapper: {
    minHeight: 130,
    backgroundColor: '#a77c7d',
    overflow: 'hidden',
    borderRadius: 4
  },

  imageBg:{
    width: '100%',
    aspectRatio: 21/9
  },

  imageBgOpacity:{
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  bottomView: {
    height: 35,
    maxHeight: 35,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  bottomViewLeft: {
    flex: 2,
    flexDirection: 'row',
    alignSelf: 'flex-end'
  },

  textContainer: {
    flex: 1
  },

  memberText: {    
    fontSize: 15,
    color: Colors.white,
    fontFamily: 'AvenirNext-DemiBold'
  },

  bottomViewRight: {
    flex: 1,
    alignItems: 'flex-end',
    marginTop: 10
  },

  fontRegular: {
    fontFamily: 'AvenirNext-Regular'
  },

  joinedView: {
    backgroundColor: Colors.white,
    opacity: 0.8,
    borderRadius: 20,
    paddingVertical: 3,
    maxWidth: 90,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },

  adminView: {
    backgroundColor: Colors.pinkRed,
    opacity: 0.8,
    borderRadius: 20,
    paddingVertical: 3,
    maxWidth: 90,
    alignItems: 'center',
    paddingHorizontal: 10,
    flexDirection: 'row'
  },

  joinView: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 5,
    paddingVertical: 4,
    alignItems: 'center',
    paddingHorizontal: 8,
    flexDirection: 'row'
  },

  joinedText: {
    color: Colors.valhalla,
    fontSize: 12,
    fontFamily: 'AvenirNext-Medium',
    fontWeight: '500',
    marginLeft:4
  },

  joinText: {
    color: Colors.valhalla,
    fontSize: 16,
    fontFamily: 'AvenirNext-DemiBold',
    marginLeft:4
  },

  adminText: {
    color: Colors.valhalla,
    fontSize: 12,
    fontFamily: 'AvenirNext-Medium',
    marginLeft:4
  },

  joinedIconSkipFont: {
    width: 10,
    height: 10.66
  },

  joinIconSkipFont:{
    width: 12.5,
    height: 12.5
  },

  adminIconSkipFont:{
    width: 12.5,
    height: 12.5
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
