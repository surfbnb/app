import React, { Component } from 'react';
import { View, Image, Text, FlatList, Dimensions } from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import { SafeAreaView } from 'react-navigation';
import ImageCropper from '../ImageCropper';

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: []
    };
    ImageBrowser.init();
    this.listRef = null;
    this.isLoading = false;
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    this.refreshPhotos();
  };

  refreshPhotos() {
    ImageBrowser.getPhotos()
      .then((photos) => {
        if (!photos) return;
        this.setState({
          photos: this.state.photos.concat(photos)
        });
        this.isLoading = false;
      })
      .catch((err) => {
        alert('Could not fetch photos!', err);
        this.isLoading = false;
      });
  }

  _renderItem({ item, index }) {
    return (
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
    );
  }

  loadMore = () => {
    clearTimeout(this.timeOut);
    this.timeOut = setTimeout(() => {
      if (this.isLoading) return;
      if (ImageBrowser.hasNextPage()) {
        this.isLoading = true;
        return this.refreshPhotos();
      }
    }, 3000);
  };

  getCroppedImage(imageUri) {}

  closeCropper() {
    this.props.navigation.navigate();
  }

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
        <View style={{ flex: 0.6, backgroundColor: 'red' }}>
          <ImageCropper imageURI={this.state.imageURI} onCrop={this.getCroppedImage} onClose={this.closeCropper} />
        </View>
        <View style={{ flex: 0.4, backgroundColor: 'blue', paddingRight: 3, paddingTop: 3 }}>
          <FlatList
            ref={(ref) => {
              this.listRef = ref;
            }}
            onEndReached={this.loadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.9}
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
