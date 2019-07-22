import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import TopStatus from "./TopStatus";
import VideoList from "./VideoList";
import Pricer from "../../services/Pricer";


export default class HomeScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null,
            headerBackTitle: null
        };
     };

    constructor(props){
        super(props);
    }

    onRefresh = () => {
        Pricer.getBalance();
    }

    render() {
        return (
            <View style={{ backgroundColor: "#000"}}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <TopStatus/>
                <VideoList fetchUrl={'/feeds'} onRefresh={this.onRefresh} />
             </View>
        )
    }
}
