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
            paused : false
        }
        this.isUserPaused = false; 
        this.pausedOnNavigation = false;
    }

    componentDidMount(){
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            payload => {
             clearTimeout(this.loadingTimeOut);    
             this.loadingTimeOut = setTimeout(()=> {
                    this.pausedOnNavigation = false;
                    if( !this.isUserPaused ){
                        this.playVideo();
                    }
                }, 300 )   
            }
        );

        this.willBlurSubscription =   this.props.navigation.addListener(
            'willBlur',
            payload => {
                clearTimeout(this.loadingTimeOut);    
                this.pausedOnNavigation = true;
                this.pauseVideo();
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
        clearTimeout(this.loadingTimeOut);   
        clearTimeout(this.activeStateTimeout);    
    }


    isPaused(){
        return !this.props.isActive || this.state.paused;
    }

    playVideo() {
        if ( this.props.isActive && this.state.paused ) {
            this.setState({paused: false});
        }
    }

    pauseVideo( isUserPaused ) {
        this.setState({paused: true});
        if( isUserPaused !== undefined ){
            this.isUserPaused = isUserPaused ;  
         }
    }

    componentDidUpdate(){
        if( !this.props.isActive && this.state.paused ) {
            this.state.paused = false;
        }
    }

    appActiveStateChanged(nextAppState) {
        let appState = nextAppState.toLowerCase();
        if ( "active" === appState && !this.isUserPaused && !this.pausedOnNavigation ) {
            this.playVideo();
        } else if ("inactive" === appState ) {
             this.pauseVideo();
        }
    }

    onPausePlayBtnClicked = () => {
        if ( this.state.paused ) {
            this.isUserPaused = false ;
            this.playVideo();
        } else {
            this.pauseVideo( true );
        }
    };

    render(){   
        console.log("Video component render " , this.props.videoImgUrl);
        return (
            <TouchableWithoutFeedback onPress={this.onPausePlayBtnClicked }>
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