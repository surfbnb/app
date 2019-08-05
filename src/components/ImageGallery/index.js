import React, { Component } from 'react';
import { View, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList, Dimensions } from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import { SafeAreaView } from 'react-navigation';
import assignIn from 'lodash/assignIn';
import store from '../../store';
import CropperUI from '../ImageCropper/CropperUI';
import { upsertProfilePicture } from '../../actions';
import appConfig from '../../constants/AppConfig';
import tickIcon from '../../assets/tick_icon.png';

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      imageURI: '',
      isLoading: false
    };
    this.listRef = null;
    this.cropperRef = null;
    this.firstImageCall = true;
  }

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null
    };
  };

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.listRef = null;
    this.cropperRef = null;
  }

  init = () => {
    this.setState({
      photos: []
    });
    ImageBrowser.init();
    this.getPhotos();
  };

  async getPhotos() {
    await ImageBrowser.getPhotos()
      .then((photos) => {
        if (!photos) return;
        let newPhotoHash = this.getPhotosHash(photos),
          oldPhotoHash = this.getPhotosHash(this.state.photos),
          finalPhotoArray = Object.values(assignIn({}, oldPhotoHash, newPhotoHash));
        this.setState(
          {
            photos: finalPhotoArray
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
      })
      .finally(() => {
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
    if (this.state.isLoading) return;
    this.getPhotos();
  };

  getCroppedImage = (imageUri) => {
    store.dispatch(
      upsertProfilePicture({
        cropped_image: imageUri
      })
    );
    this.closeCropper();
  };

  closeCropper = () => {
    this.props.navigation.goBack();
  };

  cropImage = () => {
    if (this.cropperRef) {
      this.cropperRef.cropImage();
    }
  };
  render() {
    return (
      <SafeAreaView style={inlineStyles.container}>
        <View style={{ position: 'relative', flex: appConfig.cameraHeightRatio, backgroundColor: 'black' }}>
          {this.state.imageURI ? (
            <CropperUI
              ref={(ref) => (this.cropperRef = ref)}
              imageUri={this.state.imageURI}
              screenHeightRatio={appConfig.cameraHeightRatio}
              onCrop={this.getCroppedImage}
              onClose={this.closeCropper}
            />
          ) : (
            <View />
          )}
          <TouchableOpacity
            style={{
              position: 'absolute',
              bottom: 22,
              right: 22,
              width: 45,
              height: 45
            }}
            onPress={this.cropImage}
          >
            <Image
              source={tickIcon}
              style={{
                top: 0,
                left: 0,
                width: 45,
                height: 45
              }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 0.4, backgroundColor: '#fff', paddingRight: 3, paddingTop: 3 }}>
          <FlatList
            ref={(ref) => {
              this.listRef = ref;
            }}
            extraData={this.state}
            onEndReached={this.loadMore}
            showsVerticalScrollIndicator={false}
            onEndReachedThreshold={0.8}
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
