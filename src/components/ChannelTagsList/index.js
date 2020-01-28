import React, { PureComponent } from 'react';
import { FlatList, TouchableOpacity, View, Text } from 'react-native';

import inlineStyles from './styles';
import Colors from '../../theme/styles/Colors';
import reduxGetter from '../../services/ReduxGetters';

//TODO @Preshita redux connect 

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
            data: (reduxGetter.getChannelTagIds(props.channelId) && reduxGetter.getChannelTagIds(props.channelId).unshift(0))
                     || ['0','120', '122','10549', '10259', '10350', '10348', '10349', '10480', '10621', '10324', '10426' ],
            selectedTag: this.allTag
        }
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
        //this.props.onTagClicked && this.props.onTagClicked(tag);
    }

    _renderItem = ( {item, index} ) => {
        let tagId = item;
        let tag = tagId == 0 ? this.allTag : reduxGetter.getHashTag(tagId);
        return tag && (
            <TouchableOpacity onPress={()=> this.onItemClicked(tag)}>
                <View style={inlineStyles.tagWrapper}>
                    <Text style={{color: this.isSelected(tagId) ? Colors.wildWatermelon2 : Colors.valhalla }}>
                        {tagId == 0 ? tag.text : `#${tag.text}`}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return this.state.data && (
            <View style={inlineStyles.tagListWrapper}>
                <FlatList
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    decelerationRate={'fast'}
                    data={this.state.data}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    ref={(ref) => (this.flatlistRef = ref)}
                    extraData={this.state.selectedTag}
                />
            </View>
        )
    }
}

export default ChannelTagsList;