import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import { SafeAreaView } from 'react-navigation';
import ImageCropper from '../ImageCropper';
import utilities from '../../services/Utilities';
import assignIn from 'lodash/assignIn';

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      imageURI: '',
      isLoading: false
    };
    this.listRef = null;
    this.firstImageCall = true;
  }

  componentDidMount() {
    this.init();
  }

  init = () => {
    this.setState({
      photos: []
    });
    this.getPhotos();
  };

  async getPhotos() {
    console.log('my get photos...');
    await ImageBrowser.getPhotos()
      .then((photos) => {
        console.log('fetched photos!!');
        if (!photos) return;
        let newPhotoHash = this.getPhotosHash(photos),
          oldPhotoHash = this.getPhotosHash(this.state.photos),
          finalPhotoArray = Object.values(assignIn({}, oldPhotoHash, newPhotoHash));
        this.setState(
          {
            photos: finalPhotoArray,
            isLoading: false
          },
          () => {
            if (this.firstImageCall) {
              this.firstImageCall = false;
              this.setState({
                imageURI: this.state.photos[0].node.image.uri
              });
            }
          }
        );
      })
      .catch((err) => {
        alert('Could not fetch photos!', err);
        this.setState({
          isLoading: false
        });
      });
  }

  getPhotosHash(photos) {
    const photoHash = photos.reduce(function(map, obj) {
      map[obj['node']['image']['uri']] = obj;
      return map;
    }, {});
    return photoHash;
  }

  selectImage = (uri) => {
    this.setState({
      imageURI: uri
    });
  };

  getSelected = (uri) => {
    return this.state.imageURI == uri;
  };

  _renderItem = ({ item, index }) => {
    return (
      <TouchableWithoutFeedback onPress={this.selectImage.bind(null, item.node.image.uri)}>
        <View>
          <Image
            key={index}
            style={{
              width: parseInt(Dimensions.get('window').width / 3),
              aspectRatio: 1,
              marginLeft: 3,
              marginBottom: 3,
              position: 'relative',
              backgroundColor: 'rgba(255, 255, 255, 0.5)'
            }}
            resize="contain"
            source={{ uri: item.node.image.uri }}
          />
          {this.getSelected(item.node.image.uri) ? (
            <View
              style={{
                width: parseInt(Dimensions.get('window').width / 3),
                aspectRatio: 1,
                marginLeft: 3,
                marginBottom: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.5)',
                position: 'absolute'
              }}
            ></View>
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  loadMore = () => {
    console.log('load more...');
    if (this.state.isLoading) return;
    this.getPhotos();
  };

  getCroppedImage(imageUri) {}

  closeCropper = () => {
    this.props.navigation.navigate('ProfileImagePicker');
  };

  render() {
    return (
      <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
        <View style={{ flex: 0.6, backgroundColor: 'grey' }}>
          {this.state.imageURI ? (
            <Image
              style={{ flex: 1, width: parseInt(Dimensions.get('window').width), aspectRatio: 1 }}
              source={{ uri: 'ph://54C537D7-AC80-434F-89D7-B5DEA8C6C8AB/L0/001' }}
            />
          ) : (
            <View />
          )}
        </View>
        <View style={{ flex: 0.4, backgroundColor: '#fff', paddingRight: 3, paddingTop: 3 }}>
          <FlatList
            ref={(ref) => {
              this.listRef = ref;
            }}
            extraData={this.state}
            onEndReached={this.loadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.5}
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
