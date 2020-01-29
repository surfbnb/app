
import DefaultStyleGenerator from "../../theme/styles/DefaultStyleGenerator";
import Colors from "../../theme/styles/Colors";

let stylesMap = {
    leafInnerWrapper: {
        borderTopLeftRadius: 20,
        borderBottomRightRadius: 20,
        borderWidth: 1,
        alignItems: 'center',
        marginLeft: 'auto',
        paddingHorizontal: 12,
        height: 32,
        justifyContent: 'center',
        color: Colors.white,
        borderColor: Colors.wildWatermelon2,
        flexDirection: 'row'
      },
      leafInnerText: {
        color: Colors.wildWatermelon2,
        fontFamily: 'AvenirNext-DemiBold',
        marginLeft: 8
      }
};

export default styles = DefaultStyleGenerator.generate(stylesMap);
