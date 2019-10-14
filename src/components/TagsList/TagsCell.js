import React  from 'react';
import {Text, View } from 'react-native';
import {TouchableWithoutFeedback} from "react-native";
import { withNavigation } from 'react-navigation';


let handleTagPress = (tagId, navigation) => {

    navigation.push('VideoTags', {
        tagId
    });
};

let TagCell =  (props) => {
    return <TouchableWithoutFeedback onPress={() => handleTagPress(props.tagId, props.navigation)}>
    <View style={{padding:10}} ><Text style={{fontSize: 16}}> #{props.text}</Text></View>
    </TouchableWithoutFeedback>    ;
};

export default withNavigation(TagCell);