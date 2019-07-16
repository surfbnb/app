import React, { Component } from 'react';
import {View, Image, Text, FlatList, Dimensions} from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import {SafeAreaView} from "react-navigation";
import GracefulImage from '../Giphy/GracefulImage'

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null
    };
    ImageBrowser.init();
    this.listRef = null;
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    ImageBrowser.getPhotos()
      .then((photos) => {
        if (!photos) return;
        this.setState({
          photos
        });
      })
      .catch((err) => {
        alert('Could not fetch photos!', err);
      });
  };

  _renderItem({item, index}){
    console.log(Dimensions.get('window').width);
    return(
      <Image
        key={index}
        style={{
          width: parseInt(Dimensions.get('window').width / 3),
          aspectRatio: 1,
          marginLeft: 3,
          marginBottom: 3
        }}
        resize="contain"
        source={{ uri: item.node.image.uri }}
      />
    )
  }

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'never'}} style={{ flex: 1 }}>
          <View style={{ flex: 0.6, backgroundColor: 'red' }}></View>
          <View style={{flex: 0.4, backgroundColor: 'blue', paddingRight: 3, paddingTop: 3}}>
            <FlatList
              ref={(ref) => {this.listRef = ref;}}
              contentContainerStyle={{  }}
              data={this.state.photos}
              renderItem={this._renderItem}
              numColumns={3}
              keyExtractor={(item, index) => index}
            />
          </View>
      </SafeAreaView>
    );
  }
}

export default ImageGallery;
