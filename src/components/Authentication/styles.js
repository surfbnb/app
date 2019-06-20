import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions, Platform } from 'react-native';

let stylesMap = {
  container: {
    flex: 1,
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white
  },
  form: {
    backgroundColor: Colors.white,
    width: Dimensions.get('window').width,
    paddingHorizontal: Platform.OS === 'ios' ? 20 : 30
  },
  bottomBtnAndTxt: {
    height: 70,
    position: 'absolute',
    left: 0,
    alignSelf: Platform.OS === 'ios' ? 'center' : 'flex-start',
    justifyContent: Platform.OS === 'ios' ? 'center' : 'flex-start',
    top: Dimensions.get('window').height - 80,
    width: Dimensions.get('window').width
  },
  title: {
    fontSize: 24,
    margin: 10,
    textAlign: 'center'
  },
  label: {
    textAlign: 'center',
    color: 'rgb(136,136,136)',
    fontSize: 13,
    marginBottom: 5
  },
  link: {
    textAlign: 'center',
    color: Colors.primary,
    fontSize: 15,
    fontWeight: '400',
    paddingBottom: 20
  },
  error: {
    textAlign: 'center',
    color: '#de350b',
    fontSize: 12,
    marginBottom: 6
  },
  imgPepoLogoSkipFont: {
    height: 70,
    width: 150,
    marginBottom: 10,
    alignSelf: 'center'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
