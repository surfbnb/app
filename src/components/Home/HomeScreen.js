import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import { connect } from 'react-redux';

import TopStatus from "./TopStatus";
import VideoList from "./VideoList";
import Pricer from "../../services/Pricer";
import CurrentUser from "../../models/CurrentUser";

const mapStateToProps = (state) => {
    return {
      userId: CurrentUser.getUserId()
    }
  };

class HomeScreen extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null,
            headerBackTitle: null
        };
     };

    constructor(props){
        super(props);
        this.state = {
            toRefresh : false
        }
    }

    onRefresh = () => {
        this.setState({ toRefresh : false });
        Pricer.getBalance();
    }

    componentWillUpdate(nextProps) {
        if (this.props.userId !== nextProps.userId) {
            this.state.toRefresh = true ;
        }
    }

    render() {
        console.log("HomeScreen render") ;
        return (
            <View style={{ backgroundColor: "#000"}}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                <TopStatus/>
                <VideoList toRefresh={this.state.toRefresh} fetchUrl={'/feeds'} onRefresh={this.onRefresh} />
             </View>
        )
    }
}

export default connect(mapStateToProps)(HomeScreen) ;