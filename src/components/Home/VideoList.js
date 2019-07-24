import React, { PureComponent } from 'react';
import {  FlatList } from 'react-native';
import deepGet from "lodash/get";
import flatlistHOC from "../CommonComponents/flatlistHOC";
import HomeFeedRow from "./HomeFeedRow";
import inlineStyles from "./styles";


let currentIndex = 0 ; 

class VideoList extends PureComponent {

    constructor(props){
        super(props);
        this.state = {
            activeIndex : 0  
        }
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
        return (
            <HomeFeedRow 
                isActive={ index == this.state.activeIndex }
                // doRender={  Math.abs(index - currentIndex ) < maxVideosThreshold }
                feedId={item}     
            />
    )};    

    onMomentumScrollEndCallback = () => {
        this.setActiveIndex();
    }

    render(){
        console.log("_renderItem videolist" );
        return(
            <FlatList
                extraData={this.state}
                snapToAlignment={"top"}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 90
                }}
                pagingEnabled={true}
                decelerationRate={"fast"}
                data={this.props.list}
                onEndReached={this.props.getNext}
                onRefresh={this.props.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.props.refreshing}
                initialNumToRender={3}
                onEndReachedThreshold={7}
                style={inlineStyles.fullScreen}
                onViewableItemsChanged={ this.onViewableItemsChanged}
                onMomentumScrollEnd={this.onMomentumScrollEndCallback}
                onMomentumScrollBegin={this.props.onMomentumScrollBeginCallback}
                renderItem={this._renderItem}
                showsVerticalScrollIndicator={false}
            />
        );
    }

}

export default flatlistHOC( VideoList , true );