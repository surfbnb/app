import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    marginTop: 25,
    paddingLeft: 50,
    paddingRight: 50,
    fontWeight: '300',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'space-between'
  },
  setPinInfoText: {
    textAlign: 'center',
    color: Colors.greyLite,
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '300',
    marginBottom: 20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
