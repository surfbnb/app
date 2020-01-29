import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  tagListWrapper: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#fff',
    shadowColor: "#000",
    shadowOffset: {
    width: 0,
    height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingLeft: 5
  },

  tagWrapper : {
    paddingHorizontal: 5,
    paddingVertical: 5
  },

  text : {
    fontSize: 12,
    textTransform: 'capitalize'
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
