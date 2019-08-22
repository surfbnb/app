import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  container:{
    backgroundColor: '#fff'
  },
  posterImageSkipFont: {
    aspectRatio: 3 / 4,
    height: 100,
    justifyContent: 'center'
  },
  playIconSkipFont: {
    height: 14,
    width: 14,
    alignSelf: 'center'
  },
  videoDescriptionItem: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccd3cd',
    paddingHorizontal: 15,
    paddingVertical: 20
  },
  videoDescription: {
    color: 'rgba(42, 41, 59, 0.8)',
    // flex: 1,
    flexWrap: 'wrap',
    fontFamily: 'AvenirNext-Regular',
    borderColor: 'transparent',
    borderWidth: 0,
    borderRadius: 0,
    fontWeight: '300',
    marginLeft: 10,
    marginTop: 0,
    padding: 0,
    paddingLeft: 0,
    height: 100
  },
  suggestionText: {
    fontWeight: 'bold',
    color: Colors.midNightblue,
    fontSize: 18
  },
  suggestionTextWrapper: {
    marginTop: 20
  }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
