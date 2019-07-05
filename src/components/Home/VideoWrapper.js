import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback, View} from "react-native";
import TouchableButton from '../../theme/components/TouchableButton';
import { withNavigation } from 'react-navigation';
import Theme from '../../theme/styles';
import Video from 'react-native-video';

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
        this.props.navigation.push('TransactionScreen');
    }

    render(){
        
        return (
            <View>
              <TouchableWithoutFeedback onPress={()=> this.setState({ paused : !this.state.paused })}>
                    <Video
                    style={inlineStyles.fullHeight}
                    paused={ this.isPaused() }
                    resizeMode={"contain"}
                    source={this.props.doSrc ? {uri: this.props.videoUrl} : {}}
                    repeat={true}/>
               </TouchableWithoutFeedback> 
               <TouchableButton
                TouchableStyles={[Theme.Button.btnPink, {position: "absolute",  bottom:100 , right: 0}]}
                TextStyles={[Theme.Button.btnPinkText]}
                text="Transaction"
                onPress={(e) => {this.exTransaction(e)}}
                ></TouchableButton>
           </View>
        )
    }

}

export default  withNavigation( VideoWrapper )  ; 