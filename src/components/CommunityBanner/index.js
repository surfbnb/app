import React, { Component } from 'react';
import { View, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList, Dimensions, SafeAreaView } from 'react-native';

import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import assignIn from 'lodash/assignIn';
import store from '../../store';
import CommunityBannerCropperUI from '../ImageCropper/CommunityBannerCropperUI';
import { upsertProfilePicture } from '../../actions';
import appConfig from '../../constants/AppConfig';
import tickIcon from '../../assets/tick_icon.png';

class CommunityBanner extends Component {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get('window');
    const safeViewSize = {width, height};
    this.state = {
      photos: [],
      imageURI: '',
      isLoading: false,
      safeViewSize: safeViewSize
    };
    this.listRef = null;
    this.cropperRef = null;
    this.firstImageCall = true;
    this.isLayoutDone = false;
    
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
        if (photos.length == 0) return;
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
        // Exception handled silently
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
    // store.dispatch(
    //   upsertProfilePicture({
    //     cropped_image: imageUri
    //   })
    // );
    this.closeCropper();
  };

  closeCropper = () => {
    this.props.navigation.goBack();
  };

  cropImage = () => {
    if (this.cropperRef) {
      this.cropperRef.cropImage((cropImageUri) => {
        this.props.navigation.state.params.newCommunityImage(cropImageUri);
        this.closeCropper();
      }); 
    }
  };



  getFlexHeightRatio = () => {
    const { width, height } = this.state.safeViewSize;
    console.log('this.state.safeViewSize: ', this.state.safeViewSize);
    const ratio = appConfig.communityBannerCropConstants.HEIGHT/appConfig.communityBannerCropConstants.WIDTH;
    const bannerSectionRatio = width/height;
    const cropperRatio = (width*ratio)/height;
    return {
      bannerSectionRatio: bannerSectionRatio,
      cropperRatio: cropperRatio,
      galleryRatio: 1-bannerSectionRatio,
      imageAspectRatio: ratio
    }
  }
  render() {
    const {bannerSectionRatio, cropperRatio, galleryRatio, imageAspectRatio} = this.getFlexHeightRatio();
    console.log('cropperRatio: ', cropperRatio);
    console.log('galleryRatio: ', galleryRatio);
    return (
      <SafeAreaView style={inlineStyles.container} onLayout= {event => {
        if(!this.isLayoutDone) {
          this.isLayoutDone = true;
          const layout = event.nativeEvent.layout;          
          const safeViewSize = {width: layout.width, height: layout.height};          
          this.setState({safeViewSize: safeViewSize});
        }
      }}>
        <View style={{ position: 'relative', flex: bannerSectionRatio, backgroundColor: 'black'}}>
          {this.state.imageURI ? (
            <CommunityBannerCropperUI
              ref={(ref) => (this.cropperRef = ref)}
              imageUri={this.state.imageURI}
              minCropWidth={1500}
              minCropHeight={642}
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
        <View style={{ flex: galleryRatio, backgroundColor: '#fff', paddingRight: 3, paddingTop: 3 }}>
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


export default CommunityBanner;
