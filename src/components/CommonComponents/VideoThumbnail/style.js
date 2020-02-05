import DefaultStyleGenerator from '../../../theme/styles/DefaultStyleGenerator';
import Colors from '../../../theme/styles/Colors';

let stylesMap = {
    videoStatsContainer: {
        flexDirection: 'row',
        textAlign: 'right',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end'
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
        fontWeight: '600',
        marginLeft: 5
    },

    videoInfoContainer: {
        padding: 5,
        width: '100%',
        marginBottom : 3
    },

    userNameStyle: {

    }

};

export default styles = DefaultStyleGenerator.generate(stylesMap);
