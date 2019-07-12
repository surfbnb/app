import React, { PureComponent } from 'react';
import {TouchableWithoutFeedback, AppState} from "react-native";
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
        this.wasUserPaused = false; 
    }

    componentDidMount(){
        let loadingTimeOut ; 

        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
                loadingTimeOut = clearInterval(loadingTimeOut);
                loadingTimeOut = setTimeout(()=>{
                    if( this.props.isActive && !this.wasUserPaused ){
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
                  this.setState({paused : true}); 
               }
            }
        );

        this._handleAppStateChange = (nextAppState) => {        
            clearTimeout( this.activeStateTimeout );
            this.activeStateTimeout = setTimeout( () => {
                this.appActiveStateChanged(nextAppState);
            }, 100);    
        };

        AppState.addEventListener('change', this._handleAppStateChange);
    }

    componentWillUnmount(){
        this.didFocusSubscription.remove(); 
        this.willBlurSubscription.remove(); 
        if ( this._handleAppStateChange ) {
            AppState.removeEventListener('change', this._handleAppStateChange);
        }
    }

    appActiveStateChanged(nextAppState) {
        let appState = nextAppState.toLowerCase();
        if ( "active" === appState && this.props.isActive && !this.wasUserPaused ) {
           this.setState({paused: false}); 
        } else if ("inactive" === appState && !this.isPaused() ) {
            this.setState({paused: true}); 
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

    onUserClick = () => {
        this.setState({ paused : !this.state.paused })
        this.wasUserPaused = !this.wasUserPaused; 
    }

    render(){   
        console.log("Video component render " , this.props.videoImgUrl);
        return (
            <TouchableWithoutFeedback onPress={this.onUserClick}>
                <Video
                    poster={this.props.videoImgUrl}
                    posterResizeMode={"cover"}
                    style={inlineStyles.fullHeightSkipFont}
                    paused={ this.isPaused() }
                    resizeMode={"cover"}
                    source={ {uri: this.props.videoUrl} } 
                    onLoad={this.onLoad}
                    repeat={true}/> 
            </TouchableWithoutFeedback>
        )
    }

}

export default withNavigation( VideoWrapper )  ; 