import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback, View} from "react-native";
import { withNavigation } from 'react-navigation';
import Theme from '../../theme/styles';
import Video from 'react-native-video';
import BottomStatus from "./BottomStatus";
import TopStatus from "./TopStatus";

import inlineStyles from "./styles"; 


class VideoWrapper extends PureComponent {

    constructor(props){
        super(props);
        this.player = null;
        this.state = {
            paused : false
        }
    }

    isPaused(){
        return !this.props.isActive || this.state.paused;
    }

    componentDidUpdate(){
        if( !this.props.isActive && this.state.paused ) {
            this.state.paused = false;
        }
    }

    exTransaction(e){
        this.setState({paused: true},  ()=>{
            this.props.navigation.push('TransactionScreen');
        });
    }

    render(){   
        return (
            <View>
              <TopStatus/>
              <TouchableWithoutFeedback onPress={()=> this.setState({ paused : !this.state.paused })}>
                    <Video
                    style={inlineStyles.fullHeightSkipFont}
                    paused={ this.isPaused() }
                    resizeMode={"cover"}
                    source={this.props.doSrc ? {uri: this.props.videoUrl} : {}}
                    repeat={true}/>
               </TouchableWithoutFeedback>
              <BottomStatus/>
           </View>
        )
    }

}

export default  withNavigation( VideoWrapper )  ; 