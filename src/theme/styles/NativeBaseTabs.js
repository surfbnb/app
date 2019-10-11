import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';

const scrollableTabStyles = {
    "tabsContainerStyle": {
        backgroundColor: Colors.white
    },
    "underlineStyle": {
        backgroundColor: Colors.primary,
        height: 1
    }
};

const tabStyle = {
    textStyle : { 
        color: Colors.black,
        fontSize: 25
    },
    activeTextStyle :{
        color: Colors.primary,
        fontSize: 25
    },
    activeTabStyle : {backgroundColor: Colors.white},
    tabStyle : {
        backgroundColor: Colors.white
    },
    style : {backgroundColor:  Colors.white}
}

//styles = DefaultStyleGenerator.generate(stylesMap);
export default {
    scrollableTab: DefaultStyleGenerator.generate(scrollableTabStyles),
    tab :  DefaultStyleGenerator.generate(tabStyle)
}