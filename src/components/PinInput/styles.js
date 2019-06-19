import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20
  },
  termsPoliciesInfoText: {
    alignSelf: 'center',
    marginBottom: 5,
    fontSize: 12,
    fontWeight: '300',
    color: Colors.greyLite
  },
  termsPoliciesLinkText: {
    alignSelf: 'center',
    marginBottom: 15,
    fontSize: 12,
    color: Colors.summerSky
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
