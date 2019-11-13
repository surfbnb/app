import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  pepoTxCount: {
    fontSize: 18,
    color: Colors.white,
    alignSelf: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.65)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    fontFamily: 'AvenirNext-DemiBold'
  }
}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
