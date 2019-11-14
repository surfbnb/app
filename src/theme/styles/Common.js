import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';

const styles = {
    viewContainer: {
        flex:1, backgroundColor: Colors.white
    },
    modalViewContainer: {
      flex:1,
      backgroundColor:  'rgba(0,0,0,0.5)'
    }
};

export default CommonStyle = DefaultStyleGenerator.generate(styles);
