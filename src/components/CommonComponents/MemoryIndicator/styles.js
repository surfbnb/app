import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';

let stylesMap = {

    txElem: {
        marginBottom: 20
    },

    wrapper : {
        marginBottom: 20, 
        height: 24, 
        width: 50, 
        alignItems: 'center', 
        justifyContent: 'center'
    },

    iconSkipFont : {
         height: 12, 
         width: 30
    }

}

;

export default styles = DefaultStyleGenerator.generate(stylesMap);
