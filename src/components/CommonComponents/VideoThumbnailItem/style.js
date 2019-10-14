import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
    videoStatsContainer: {
        padding: 5,
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    videoStatsTxt: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'AvenirNext-Regular',
        marginLeft: 2
    },
    videoDescStyle: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'AvenirNext-Regular',
    },

    videoUserNameStyle: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'AvenirNext-Regular',
        fontWeight: '600'
    },

    videoInfoContainer: {
        padding: 5,
        width: '100%'
    },

    userNameStyle: {

    }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
