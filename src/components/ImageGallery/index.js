import React, { Component } from 'react';
import { View, Image, TouchableWithoutFeedback, FlatList, Dimensions, Platform } from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import { SafeAreaView } from 'react-navigation';
import assignIn from 'lodash/assignIn';
import UploadToS3 from '../../services/UploadToS3';
import CropperUI from '../ImageCropper/CropperUI';
import ImageResizer from 'react-native-image-resizer';
import RNFS from 'react-native-fs';
import CurrentUser from '../../models/CurrentUser';
import PepoApi from '../../services/PepoApi';
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
    if (this.state.isLoading) return;
    this.getPhotos();
  };

  getCroppedImage = async (imageUri) => {
    if (!imageUri) return;

    if (Platform.OS === 'ios') {
      const outputPath = `${RNFS.CachesDirectoryPath}/Pepo/${new Date().getTime()}.jpg`;
      // The imageStore path here is "rct-image-store://0"
      ImageResizer.createResizedImage(
        imageUri,
        appConfig.cameraCropConstants.WIDTH,
        appConfig.cameraCropConstants.HEIGHT,
        'JPEG',
        25,
        0,
        outputPath
      )
        .then(async (success) => {
          await this.uploadToS3(success.path);
        })
        .catch((err) => {
          console.log('Could not get resized image', err);
        });
    } else {
      await this.uploadToS3(imageUri);
    }
  };

  uploadToS3 = async (uri) => {
    const uploadToS3 = new UploadToS3(uri, 'image');
    const s3Url = await uploadToS3.perform();
    console.log('image upload url', s3Url);
    this.saveToServer(s3Url);
  };

  saveToServer = (s3Url) => {
    const userId = CurrentUser.getUserId();
    new PepoApi(`/users/${userId}/profile-image`)
      .post({
        image_url: s3Url
      })
      .catch((error) => {
        console.log('Profile image could not be saved to server', error);
      })
      .then((res) => {
        console.log('Profile image saved to server', res);
        this.closeCropper();
      });
  };

  closeCropper = () => {
    this.props.navigation.navigate('ProfileScreen');
  };

  cropImage = () => {
    if (this.cropperRef) {
      this.cropperRef.cropImage();
    }
  };
  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
          <TouchableWithoutFeedback onPress={this.cropImage}>
            <Image
              source={tickIcon}
              style={{
                position: 'absolute',
                bottom: 22,
                right: 22,
                width: 45,
                height: 45
              }}
            />
          </TouchableWithoutFeedback>
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
