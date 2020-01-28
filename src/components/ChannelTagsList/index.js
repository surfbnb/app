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
        this.state ={
            data: reduxGetter.getChannelTagIds(props.channelId)
                     || ['120', '122','10549', '10259', '10350', '10348', '10349', '10480', '10621', '10324', '10426' ],
            selectedTags: [] //@Preshita Dont use array here
        }
    }

    _keyExtractor = (item, index) => {
        return `id_${item.id}_${index}`;
    };

    isSelected = (tagId) => {
        if(this.state.selectedTags.indexOf(tagId) != -1){
            return true;
        } else {
            return false;
        }
    }

    onItemClicked = (tagId) => {
        let selectedTags = this.state.selectedTags.splice(0),
            clickedItemIndex = this.state.selectedTags.indexOf(tagId);
        if(clickedItemIndex == -1){
            selectedTags.push(tagId);
        } else {
            selectedTags.splice(clickedItemIndex, 1);
        }
        this.setState({
            selectedTags
        })
        this.props.onTagClicked && this.props.onTagClicked(selectedTags);
    }

    _renderItem = ( {item, index} ) => {
        let tagId = item;
        return reduxGetter.getHashTag(tagId) && (
            <TouchableOpacity onPress={()=> this.onItemClicked(tagId)}>
                 <View style={{height: 30, padding: 5, fontSize: 12}}>
                    <Text style={{color: this.isSelected(tagId) ? Colors.wildWatermelon2 : Colors.valhalla, }}>
                        #{reduxGetter.getHashTag(tagId).text}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

    render() {
        return this.state.data && (
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                decelerationRate={'fast'}
                data={this.state.data}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={[inlineStyles.container, this.props.customStyles]}
                renderItem={this._renderItem}
                ref={(ref) => (this.flatlistRef = ref)}
            />
        )
    }
}

export default ChannelTagsList;