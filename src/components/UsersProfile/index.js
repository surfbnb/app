import React, { Component } from 'react';
import { View , Text } from 'react-native';
import UserInfo from '../../components/CommonComponents/UserInfo'

export default class UsersProfile extends Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <View style={{ backgroundColor: "#fff"}}>
                <UserInfo/>
             </View>
        )
    }
}