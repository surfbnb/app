import React, { PureComponent } from 'react';
import {FlatList, Text, TouchableOpacity} from 'react-native';

import inlineStyles from './styles';
import LinearGradient from "react-native-linear-gradient";
import { withNavigation } from 'react-navigation';
import Utilities from '../../../services/Utilities';
import multipleClickHandler from '../../../services/MultipleClickHandler';


class ChannelNamesFlatlist extends PureComponent {

    constructor( props ){
        super( props );
        this.flatlistRef = null;
        //@Ashutosh integrate with
        this.data = ["ETHDENVER 2020", 'Epicenter', "ETHDENVER 2020", "ETHDENVER 2020", 'Epicenter', "ETHDENVER 2020"]
    }

    _keyExtractor = (item, index) => {
        return `id_${item.id}_${index}`;
    };

    _navigateToChannel =(item={}) => {
        if(!Utilities.checkActiveUser()) return;
        //@Ashutosh integrate with
        this.props.navigation.push("ChannelsScreen" , {} );
    }

    _renderItem = ( {item} ) => {
        return (<TouchableOpacity onPress={multipleClickHandler(() => this._navigateToChannel( item ))}>
                    <LinearGradient
                    colors={['rgba(255, 85, 102, 0.85)', 'rgba(203, 86, 151, 0.85)', 'rgba(203, 86, 151, 0.85)', 'rgba(255, 116, 153, 0.85)']}
                    locations={[0, 0.5, 0.55, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ marginRight: 8, borderTopLeftRadius: 25, borderBottomRightRadius: 25, paddingLeft: 15, paddingRight: 15, paddingVertical: 6}}
                    >
                        <Text style={{fontSize: 12, color: '#fff', fontFamily: 'AvenirNext-DemiBold'}}>{item}</Text>
                    </LinearGradient>
               </TouchableOpacity>
        );
    }

    render() {
        return (
            <FlatList
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                decelerationRate={'fast'}
                data={this.data}
                keyExtractor={this._keyExtractor}
                contentContainerStyle={[inlineStyles.hList]}
                renderItem={this._renderItem}
                ref={(ref) => (this.flatlistRef = ref)}
            />
        )
    }
}

export default withNavigation( ChannelNamesFlatlist );