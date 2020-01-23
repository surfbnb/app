import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {
    wrapper : {
        marginBottom: 20, 
        height: 40, 
        width: 40, 
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 20
    }
}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
