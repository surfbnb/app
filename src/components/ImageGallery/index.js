import React, { Component } from 'react';
import { View, Button, ScrollView, Image, Text } from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: null
    };
    ImageBrowser.init();
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 0.6 }}></View>
        <ScrollView style={{ flex: 0.4 }}>
          {this.state.photos ? (
            this.state.photos.map((p, i) => {
              return (
                <Image
                  key={i}
                  style={{
                    width: 300,
                    height: 100
                  }}
                  source={{ uri: p.node.image.uri }}
                />
              );
            })
          ) : (
            <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
              <Text>Loading images...</Text>
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

export default ImageGallery;
