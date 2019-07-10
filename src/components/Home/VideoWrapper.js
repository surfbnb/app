import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback, Image} from "react-native";
import { withNavigation } from 'react-navigation';
import Video from 'react-native-video';
import inlineStyles from "./styles"; 

//TODO inactive app handling 

class VideoWrapper extends PureComponent {

    constructor(props){
        super(props);
        this.player = null;
        this.state = {
            paused : false,
            loaded: false
        }
        this.wasAutoPaused = false; 
    }

    componentDidMount(){
        let loadingTimeOut ; 

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                setTimeout(()=>{
                    if( this.props.isActive && this.wasAutoPaused ){
                        this.setState({paused : false});
                    }
                }, 300 )   
            }
        );

        this.willBlurSubscription =   this.props.navigation.addListener(
            'willBlur',
            payload => {
               clearInterval(loadingTimeOut);
               if(!this.isPaused()){
                  this.setState({paused : true})
                  this.wasAutoPaused = true ; 
               }
            }
        );
    }

    componentWillUnmount(){
        this.didFocusSubscription.remove(); 
        this.willBlurSubscription.remove(); 
    }


    isPaused(){
        return !this.props.isActive || this.state.paused;
    }

    componentDidUpdate(){
        if( !this.props.isActive && this.state.paused ) {
            this.state.paused = false;
        }
    }

    onLoad = () => {
        console.log(".......loaded........");
        this.setState({loaded : true});
    }

    render(){   
        console.log("Video component render " , this.props.videoImgUrl);
        return (
            <TouchableWithoutFeedback onPress={()=> this.setState({ paused : !this.state.paused })}>
               <React.Fragment> 
                    {/* {!this.state.loaded &&
                        <Image style={inlineStyles.fullHeightSkipFont} source={{uri: this.props.videoImgUrl}}></Image>  
                    }
                    {this.state.loaded &&  */}
                        <Video
                            poster={this.props.videoImgUrl}
                            posterResizeMode={"cover"}
                            style={inlineStyles.fullHeightSkipFont}
                            paused={ this.isPaused() }
                            resizeMode={"cover"}
                            source={ {uri: this.props.videoUrl} } 
                            onLoad={this.onLoad}
                            repeat={true}/>
                    {/* } */}
                </React.Fragment>    
            </TouchableWithoutFeedback>
        )
    }

}

export default withNavigation( VideoWrapper )  ; 