import React from 'react';
import {View , Image , Platform} from "react-native";
import BackArrow from '../../assets/back-arrow.png';

export default function(){
    return (
        <View style={{ paddingRight: 30, paddingVertical: 30, paddingLeft: Platform.OS === 'ios' ? 20 : 0 }}>
            <Image source={BackArrow} style={{ width: 10, height: 18, paddingLeft: 8 }} />
        </View>
    );
}