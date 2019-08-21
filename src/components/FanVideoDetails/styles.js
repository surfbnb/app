import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container: {
    flex: 1,
    paddingBottom: 30,
    justifyContent: 'space-between',
    backgroundColor: '#fff'
  },
  posterImageSkipFont: {
    aspectRatio: 3 / 4,
    width: 80,
    justifyContent: 'center'
  },
  playIconSkipFont: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
  videoDescriptionItem:{
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccd3cd',
    paddingHorizontal: 15,
    paddingVertical: 10
  },
  videoDescription:{
    color: 'rgba(42, 41, 59, 0.8)',
    marginLeft: 20,
    flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'AvenirNext-Regular'
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
