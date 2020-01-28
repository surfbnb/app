import DefaultStyleGenerator from '../../theme/styles/DefaultStyleGenerator';
import Colors from '../../theme/styles/Colors';

let stylesMap = {
  tagListWrapper: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },

  tagWrapper : {
    height: 30, 
    paddingHorizontal: 5, 
    fontSize: 12
  }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
