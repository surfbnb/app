import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';

import flatlistHOC from "../flatlistHOC";
import inlineStyles from './styles';

class HFlatlist extends PureComponent {

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
                pagingEnabled={true}
                decelerationRate={'fast'}
                data={this.props.payloadList}
                onRefresh={this.props.refresh}
                keyExtractor={this._keyExtractor}
                refreshing={this.props.refreshing}
                onEndReachedThreshold={10}
                contentContainerStyle={[inlineStyles.container, this.props.customStyles]}
                renderItem={this._renderItem}
                ref={(ref) => (this.flatlistRef = ref)}
            />
        )
    }
}

export default flatlistHOC( HFlatlist );