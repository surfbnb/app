import React  from 'react';
import {Text, View , TouchableWithoutFeedback} from 'react-native';
import { withNavigation } from 'react-navigation';


const handleTagPress = (tagId, navigation) => {

    navigation.push('VideoTags', {
        "tagId": tagId
    });
};

let TagCell =  (props) => {
  return <TouchableWithoutFeedback onPress={() => handleTagPress(props.tagId, props.navigation)}>
    <View style={{padding:10}} ><Text style={{fontSize: 14}}> #{props.text}</Text></View>
  </TouchableWithoutFeedback>;
};

export default withNavigation(TagCell);