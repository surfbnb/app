import React, { Component } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import deepGet from "lodash/get";
import Video from "./VideoWrapper";
import inlineStyles from "./styles";

import TikTokDummyData from './videoDummydata';
const videoData =  TikTokDummyData.body.itemListData; 

let currentIndex = 0 ; 

export default class Videos extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null
        };
     };

    constructor(){
        super();
        this.state = {
            activeIndex : 0  
        }
        this.flatList = null;
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
                                        videoUrl={item.itemInfos.video.urls[0]} 
                                        />}
                        />
             </View>
        )
    }
}
