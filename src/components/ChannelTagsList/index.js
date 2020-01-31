import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import {connect} from "react-redux";

import inlineStyles from './styles';
import Colors from '../../theme/styles/Colors';
import reduxGetter from '../../services/ReduxGetters';

//TODO @Preshita redux connect 

const mapStateToProps = (state, ownProps) => {
    return {
      tagIds: reduxGetter.getChannelTagIds(ownProps.channelId) || []
    };
  };


class ChannelTagsList extends PureComponent {

    constructor( props ){
        super( props );
        this.flatlistRef = null;
        this.allTag = {
            id: 0,
            status: null,
            text: "All",
            uts: null,
            video_weight: null,
            weight: null
        }
        this.state = {
            selectedTag: this.allTag
        }
        this.setAllOption();
    }

    setAllOption = () => {
        this.tagIds = this.props.tagIds.slice(0);
        this.tagIds.unshift('0');
    }

    componentDidUpdate(){
        this.setAllOption();
    }

    _keyExtractor = (item, index) => {
        return `id_${item.id}_${index}`;
    };

    isSelected = (tagId) => {
       return this.state.selectedTag.id == tagId;
    }

    onItemClicked = (tag) => {
        this.setState({
            selectedTag : tag
        })
        this.props.onTagClicked && this.props.onTagClicked(tag);
    }

    _renderItem = ( {item, index} ) => {
        let tagId = item;
        let tag = tagId == 0 ? this.allTag : reduxGetter.getHashTag(tagId);
        return tag && (
            <TouchableOpacity onPress={()=> this.onItemClicked(tag)}>
                <View style={inlineStyles.tagWrapper}>
                    <Text style={[inlineStyles.text, {color: this.isSelected(tagId) ? Colors.wildWatermelon2 : Colors.valhalla }]}>
                        {tagId == 0 ? tag.text : `#${tag.text}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return this.tagIds && (
            <View style={inlineStyles.tagListWrapper}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={'fast'}
                    data={this.tagIds}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ref={(ref) => (this.flatlistRef = ref)}
                    extraData={this.state.selectedTag}
                />
            </View>
        )
    }
}

export default connect(mapStateToProps)(ChannelTagsList);