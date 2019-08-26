import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.black,
    alignSelf: 'stretch'
  },
  previewVideoSkipFont: {
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  },
  progressBar: {
    position: 'absolute',
    top: 40,
    borderRadius: 3.5,
    borderColor: Colors.white,
    borderWidth: 0.5,
    height: 7,
    width: '90%',
    marginLeft: 10,
    marginRight: 10
  },
  cancelButton: {
    position: 'absolute',
    top: 55,
    height: 50,
    width: 50,
    marginLeft: 20
  },
  cancelText: {
    color: Colors.white,
    fontWeight: 'bold'
  },
  bottomControls: {
    flex: 1,
    position: 'absolute',
    bottom: 40,
    flexDirection: 'row',
    width: '50%',
    alignSelf: 'flex-end',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playIconSkipFont: {
    width: 65,
    height: 65,
    paddingHorizontal: 20,
    marginLeft: -32.5
  },
  // tickIconSkipFont: {
  //   width: 45,
  //   height: 45,
  //   marginRight: 20
  // },
  closeBtWrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: 60,
    width: 60
  },
  closeIconSkipFont: {
    marginTop: 44,
    marginLeft: 20,
    height: 20,
    width: 20
  },
  triangleRight:{
    width: 0,
    height: 0,
    position: 'absolute',
    right: -29,
    top: '50%',
    marginTop: -8,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 22,
    borderRightWidth: 22,
    borderBottomWidth: 16,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#ff5566',
    transform: [
      {rotate: '90deg'}
    ]

  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
