import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';
import { Dimensions } from 'react-native';

let stylesMap = {
  container: {
    flex: 1,
    backgroundColor: Colors.white
  },
  form: {
    backgroundColor: Colors.white,
    width: Dimensions.get('window').width,
    paddingLeft: 30,
    paddingRight: 30
  },
  bottomBtnAndTxt: {
    flex: 1,
    justifyContent: 'flex-end'
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
    marginBottom: 20,
    fontWeight: '400'
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
