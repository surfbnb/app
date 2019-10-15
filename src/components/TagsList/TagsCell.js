import React  from 'react';
import {Text, View } from 'react-native';
import {TouchableWithoutFeedback} from "react-native";
import { withNavigation } from 'react-navigation';


const handleTagPress = (tagId, navigation) => {

    navigation.push('VideoTags', {
        tagId
    });
};

const showTag = (props) => {
    return <TouchableWithoutFeedback onPress={() => handleTagPress(props.tagId, props.navigation)}>
        <View style={{padding:10}} ><Text style={{fontSize: 16}}> #{props.text}</Text></View>
    </TouchableWithoutFeedback>    ;
};

let TagCell =  (props) => {
    if(props.isEmpty){
        return props.emptyRenderFunction()
    } else {
        return showTag(props)
    }

};

export default withNavigation(TagCell);