import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.black,
    alignSelf: 'stretch'
  },
  previewVideo: {
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
  playIcon: {
    width: 65,
    height: 65,
    paddingHorizontal: 20,
    marginLeft: -32.5
  },
  tickIcon: {
    width: 45,
    height: 45,
    marginRight: 20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);