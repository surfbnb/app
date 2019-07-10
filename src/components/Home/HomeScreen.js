import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import TopStatus from "./TopStatus";
import VideoList from "./VideoList";

export default class Videos extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null,
            headerBackTitle: null
        };
     };

    constructor(props){
        super(props);
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
