import React, { Component } from 'react';
import { View , Text } from 'react-native';

export default class UsersProfile extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={{ backgroundColor: "#fff"}}>
                <Text> HEllo is userprofile screen</Text>
             </View>
        )
    }
}