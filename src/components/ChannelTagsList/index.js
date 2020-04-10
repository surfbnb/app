import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import {connect} from "react-redux";

import inlineStyles from './styles';
import Colors from '../../theme/styles/Colors';
import reduxGetter from '../../services/ReduxGetters';
import findIndex from "lodash/findIndex";
import unescape from 'lodash/unescape';
import { withNavigation } from 'react-navigation';

const defaultArray = [];
const mapStateToProps = (state, ownProps) => {
    return {
      tagIds: reduxGetter.getChannelTagIds(ownProps.channelId, state) ||defaultArray 
    };
  };

class ChannelTagsList extends PureComponent {

    constructor( props ){
        super( props );
        this.flatlistRef = null;
        this.allTag = {
            id: 0,
            text: "All"
        }  
        const selectedTag = props.selectedTag || this.allTag;
        this.state = {
            selectedTag,
            didFocus: true
        }
        this.initialScrollIndex = findIndex(this.props.tagIds , (id)=> (id == selectedTag.id)) || 0;
        this.setInitialSelectedTag();
    }

    componentDidMount(){
        this.willFocus = this.props.navigation.addListener('willFocus', (payload) => {
           this.setState({didFocus:true});
           this.updateSelectedTag();
        });
        this.didBlur = this.props.navigation.addListener('didBlur', (payload) => {
           this.setState({didFocus:false});
        });
    }

    componentWillUnmount(){
        this.willFocus &&  this.willFocus.remove &&  this.willFocus.remove();
        this.didBlur && this.didBlur.remove && this.didBlur.remove();
    }

    updateSelectedTag = () => {
        for(let cnt = 0 ; cnt < this.props.tagIds.length; cnt++){
            if(this.isSelected(this.props.tagIds[cnt])){
                return;
            }
        }
        const tagId = this.props.tagIds[0] ,
              tag = tagId == 0 ? this.allTag : reduxGetter.getHashTag(tagId); 
        this.onItemClicked(tag);
    }

    setInitialSelectedTag(){
        if(this.props.tagIds.length == 1){
            this.state.selectedTag = reduxGetter.getHashTag(this.props.tagIds[0]);
        }
    }

    _keyExtractor = (item, index) => {
        return `id_${item.id}_${index}`;
    };

    isSelected = (tagId) => {
       return this.state.selectedTag && this.state.selectedTag.id == tagId;
    }

    onItemClicked = (tag) => {
        if(!tag) return;
        this.setState({
            selectedTag : tag
        })
        this.props.onTagClicked && this.props.onTagClicked(tag);
    }

    _renderItem = ( {item, index} ) => {
        let tagId = item;
        let tag = tagId == 0 ? this.allTag : reduxGetter.getHashTag(tagId),
            text = tag && unescape(tag.text)
        ;
        return tag && (
            <TouchableOpacity onPress={()=> this.onItemClicked(tag)}>
                <View style={inlineStyles.tagWrapper}>
                    <Text style={[inlineStyles.text, {color: this.isSelected(tagId) ? Colors.wildWatermelon2 : Colors.valhalla }]}>
                        {tagId == 0 ? text : `#${text}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    onScrollToIndexFailed =( info) => {
        console.log("======onScrollToIndexFailed=====" , info );
    }

    getTagIds = () => {
        let tagIds = this.props.tagIds.slice(0) ;
        if(tagIds.length > 1){
            tagIds.unshift(0);
        }
        return tagIds;
    }
    
    render() {
        const tagIds = this.getTagIds();
        return tagIds && this.state.didFocus && (
            <View style={inlineStyles.tagListWrapper}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    data={tagIds}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ref={(ref) => (this.flatlistRef = ref)}
                    extraData={this.state}
                    initialScrollIndex={this.initialScrollIndex}
                    onScrollToIndexFailed={this.onScrollToIndexFailed}
                />
            </View>
        )
    }
}

export default connect(mapStateToProps)(withNavigation( ChannelTagsList ));