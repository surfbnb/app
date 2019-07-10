import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import TopStatus from "./TopStatus";
import VideoList from "./VideoList";
import Pricer from "../../services/Pricer";

export default class Videos extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null,
            headerBackTitle: null
        };
     };

    constructor(props){
        super(props);
        Pricer.getToken();
    }

    render() {
        return (
            <View style={{ backgroundColor: "#fff"}}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <TopStatus/>
                <VideoList fetchUrl={'/feeds'}/>
             </View>
        )
    }
}
