import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

import inlineStyles from './styles';

class ChannelNamesFlatlist extends PureComponent {

    constructor( props ){
        super( props );
        this.flatlistRef = null;
    }

    _keyExtractor = (item, index) => {
        return `id_${item.id}_${index}`;
    };

    _renderItem = ( {item} ) => {
        let ItemComponent = this.props.itemComponent;
        return <ItemComponent item={item}/>;
    }

    render() {
        return (
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                decelerationRate={'fast'}
                data={this.props.payloadList}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={[inlineStyles.container, this.props.customStyles]}
                renderItem={this._renderItem}
                ref={(ref) => (this.flatlistRef = ref)}
            />
        )
    }
}

export default ChannelNamesFlatlist;