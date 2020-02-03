import DefaultStyleGenerator from './DefaultStyleGenerator';
import Colors from './Colors';

const scrollableTabStyles = {
    "tabsContainerStyleSkipFont": {
        backgroundColor: Colors.white
    },
    "underlineStyleSkipFont": {
        backgroundColor: Colors.primary,
        height: 2
    }
};

const tabStyle = {
    textStyle : { 
        color: Colors.black,
        fontSize: 25,
        marginLeft: 0,
        marginRight: 0
    },
    activeTextStyle :{
        color: Colors.primary,
        fontSize: 25,
        marginLeft: 0,
        marginRight: 0
       // fontWeight : 'bold'
    },
    activeTabStyle : {
        backgroundColor: Colors.white,
        paddingLeft: 10,
        paddingRight: 10,
        flexGrow: 1
    },
    tabStyleSkipFont : {
        backgroundColor: Colors.white,
        paddingLeft: 10,
        paddingRight: 10,
        flexGrow: 1
    },
    style : {backgroundColor:  Colors.white}
}

//styles = DefaultStyleGenerator.generate(stylesMap);
export default {
    scrollableTab: DefaultStyleGenerator.generate(scrollableTabStyles),
    tab :  DefaultStyleGenerator.generate(tabStyle)
}