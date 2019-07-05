import React, { Component } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import deepGet from "lodash/get";
import Video from "./VideoWrapper";
import inlineStyles from "./styles";

import TikTokDummyData from './videoDummydata';
const videoData =  TikTokDummyData.body.itemListData; 

let currentIndex = 0 ; 
const maxVideosThreshold = 5;

export default class Videos extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null
        };
     };

    constructor(props){
        super(props);
        this.state = {
            activeIndex : 0  
        }
        this.flatList = null;
    }

    componentDidMount(){
        let loadingTimeOut ; 

        this.didFocusSubscription =   this.props.navigation.addListener(
            'didFocus',
            payload => {
                setTimeout(()=>{
                    this.onMomentumScrollEnd();
                }, 300 )   
            }
        );

        this.willBlurSubscription =   this.props.navigation.addListener(
            'willBlur',
            payload => {
               clearInterval(loadingTimeOut);
               this.setState( { activeIndex : -1 } );
            }
        );
    }

    componentWillUnmount(){
        this.didFocusSubscription.remove(); 
        this.willBlurSubscription.remove(); 
    }

    onViewableItemsChanged( data ){
        currentIndex =  deepGet( data , "viewableItems[0].index") ; 
    }

    onMomentumScrollEnd( ){
        if(this.state.activeIndex == currentIndex )return; 
        this.setState( { activeIndex : currentIndex } );
    }

    render() {
        return (
            <View style={{ backgroundColor: "black"}}>
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                        <FlatList
                            ref={(ref) => { this.flatList = ref }}
                            snapToAlignment={"center"}
                            pagingEnabled={true}
                            decelerationRate={"fast"}
                            data={videoData}
                            keyExtractor={(item, index) => `id_${index}`}
                            style={inlineStyles.fullScreen}
                            onViewableItemsChanged={this.onViewableItemsChanged}
                            onMomentumScrollEnd={ (e) => {this.onMomentumScrollEnd(e)} }
                            renderItem={({ item , index }) => <Video 
                                        isActive={ index === this.state.activeIndex }
                                        doSrc={ true || Math.abs(index - this.state.activeIndex) < maxVideosThreshold }
                                        videoUrl={item.itemInfos.video.urls[0]} 
                                        />}
                        />
             </View>
        )
    }
}
