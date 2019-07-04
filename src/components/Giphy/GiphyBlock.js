import React, { PureComponent } from 'react';

import {
View,
Text,
TouchableWithoutFeedback,
Dimensions
} from 'react-native';

import FastImage from 'react-native-fast-image';
import appConfig from '../../constants/AppConfig';
import GracefulImage from './GracefulImage';
import inlineStyles from './styles';

const bgColors = [
'rgb(255,140,140)',
'rgb(253,244,128)',
'rgb(5,217,200)',
'rgb(59,188,255)',
'rgb(242,212,121)',
'rgb(164,251,158)',
'rgb(251,162,255)',
'rgb(55,108,180)',
'rgb(141,121,242)'
] ; 

class GiphyBlock extends PureComponent {

    constructor(props){
        super(props); 
        this.screenWidth = Dimensions.get('window').width;
    }

    render(){

        let colWidth = (this.screenWidth - 62) / 3,
        itemWidth = 200,
        ratio = colWidth / itemWidth,
        wh = itemWidth * ratio; 

        return (
            <TouchableWithoutFeedback key={this.props.item.id} onPress={() => this.props.handleGiphyPress(this.props.item)}>
                <View style={ { margin: 3,borderRadius: 4,overflow: 'hidden'} } >
                    <GracefulImage
                    style={{ width: wh, height: wh }}
                    source={{uri: this.props.item[appConfig.giphySizes.search].url, priority: FastImage.priority.high}}
                    showActivityIndicator={this.props.isGifCategory ? false : true}
                    imageBackgroundColor={bgColors}  />
                    {this.props.isGifCategory && (
                    <View style={[ inlineStyles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)',height: wh, width: wh}]}>
                        <Text style={inlineStyles.overlayText}>{this.props.item.name}</Text>
                    </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        )
    }

}

export default GiphyBlock; 