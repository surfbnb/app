import React, { PureComponent } from 'react';
import {  FlatList , AppState} from 'react-native';
import deepGet from "lodash/get";
import flatlistHOC from "../CommonComponents/flatlistHOC";
import HomeFeedRow from "./HomeFeedRow";
import inlineStyles from "./styles";

import Pricer from "../../services/Pricer";


let currentIndex = 0 ; 
const maxVideosThreshold = 5;

class VideoList extends PureComponent {

    constructor(props){
        super(props);
        this.state = {
            activeIndex : 0  
        }
        Pricer.getToken(); 
    }

    onViewableItemsChanged( data ){
        currentIndex =  deepGet( data , "viewableItems[0].index") ; 
    }

    setActiveIndex() {
        if( this.state.activeIndex == currentIndex )return; 
        this.setState( { activeIndex : currentIndex } );
    }

    _keyExtractor = (item, index) => `id_${item}` ;

    _renderItem = ({item, index}) => {
        console.log("_renderItem", item , index );
        return (
            <HomeFeedRow 
                isActive={ index === this.state.activeIndex }
                doRender={  Math.abs(index - currentIndex ) < maxVideosThreshold }
                feedId={item}     
            />
    )};    

    render(){
        console.log("_renderItem videolist" );
        return(
            <FlatList
                snapToAlignment={"center"}
                pagingEnabled={true}
                decelerationRate={"fast"}
                data={this.props.list}
                onEndReached={this.props.getNext}
                onRefresh={this.props.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.props.refreshing}
                onEndReachedThreshold={5}
                style={inlineStyles.fullScreen}
                onViewableItemsChanged={this.onViewableItemsChanged}
                onMomentumScrollEnd={ (e) => {this.setActiveIndex(e)} } 
                onMomentumScrollBegin={this.props.onMomentumScrollBeginCallback}
                renderItem={this._renderItem}
            />
        );
    }

}

export default flatlistHOC( VideoList , true );