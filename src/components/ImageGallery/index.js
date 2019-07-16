import React, { Component } from 'react';
import {View, Button, Image, Text, FlatList} from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';

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
    return(
      <Image
        key={index}
        style={{
          width: 300,
          height: 100
        }}
        resize="contain"
        source={{ uri: item.node.image.uri }}
      />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.6, backgroundColor: 'red' }}></View>
        <View style={{flex: 0.4, backgroundColor: 'blue'}}>
          <FlatList
            ref={(ref) => {this.listRef = ref;}}
            contentContainerStyle={{ }}
            data={this.state.photos}
            renderItem={this._renderItem}
            numColumns={3}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    );
  }
}

export default ImageGallery;
