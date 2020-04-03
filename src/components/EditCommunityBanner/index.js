import React, { Component } from 'react';
import { View, Image, TouchableOpacity, TouchableWithoutFeedback, FlatList, Dimensions, SafeAreaView, Text } from 'react-native';
import inlineStyles from './styles';
import ImageBrowser from '../../services/ImageBrowser';
import assignIn from 'lodash/assignIn';
import CommunityBannerCropperUI from '../EditCommunityBanner/CommunityBannerCropperUI';
import tickIcon from '../../assets/tick_icon.png';
import AppConfig from '../../constants/AppConfig';
import GalleryIcon from '../../assets/gallery_icon.png';

class EditCommunityBanner extends Component {
  constructor(props) {
    super(props);
    const { width, height } = Dimensions.get('window');
    this.state = {
      photos: [],
      imageURI: '',
      isLoading: false,
      safeAreaViewHeight: width,
      safeAreaViewWidth: height,
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
        if (photos.length == 0) return;
        let newPhotoHash = this.getPhotosHash(photos),
          oldPhotoHash = this.getPhotosHash(this.state.photos),
          finalPhotoArray = Object.values(assignIn({}, oldPhotoHash, newPhotoHash));
        this.setState(
          {
            photos: finalPhotoArray
          },
          () => {
            if (this.firstImageCall && this.state.photos.length > 0) {
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
    const width = parseInt(Dimensions.get('window').width / 3);
    return (
      <TouchableWithoutFeedback onPress={this.selectImage.bind(null, item.node.image.uri)}>
        <View>
          <Image
            key={index}
            style={{...inlineStyles.galleryItem, width: width}}
            resize="contain"
            source={{ uri: item.node.image.uri }}
          />
          {this.getSelected(item.node.image.uri) ? <View style={{...inlineStyles.galleryItem, width: width, position: 'absolute'}}/> : <View/>}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  loadMore = () => {
    if (this.state.isLoading) return;
    this.getPhotos();
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

  onSafeAreaLayout = (event) => {
    const layout = event.nativeEvent.layout;          
    if(this.state.safeAreaViewHeight !== layout.height 
        || this.state.safeAreaViewWidth !== layout.width) {
      const safeViewSize = {
        safeAreaViewWidth: layout.width,
        safeAreaViewHeight: layout.height
      };
      this.setState((prevState) => ({
        ...prevState,
        ...safeViewSize
      }));
    }
  }
  render() {
    const cropSectionFlexRatio = this.state.safeAreaViewWidth/this.state.safeAreaViewHeight;
    const gallerySectionFlexRatio = 1-cropSectionFlexRatio;    
    return (
      <SafeAreaView style={inlineStyles.container} onLayout= {event => {
        this.onSafeAreaLayout(event);
      }}>
        <View style={{...inlineStyles.cropSection, flex: cropSectionFlexRatio}}>
          {this.state.imageURI ? (
            <CommunityBannerCropperUI
              ref={(ref) => (this.cropperRef = ref)}
              imageUri={this.state.imageURI}
              minCropWidth={AppConfig.communityBannerSize.WIDTH}
              minCropHeight={AppConfig.communityBannerSize.HEIGHT}
              onClose={this.closeCropper}
            />
          ) : (
            <View />
          )}
          <TouchableOpacity style={inlineStyles.tickIconTouchable} onPress={this.cropImage}>
            <Image source={tickIcon} style={inlineStyles.tickIcon}/>
          </TouchableOpacity>
        </View>
        <View style={{
            ...inlineStyles.gallerySection,
            flex: gallerySectionFlexRatio,
            display: this.state.photos.length>0 ? 'none' : 'flex'
        }}>          
          <View style={{
            alignItems: 'center',
            flex: 1,
            marginTop: '25%',
            marginHorizontal: 30
          }}>
            <Image source={GalleryIcon} style={{height: 40, width: 40,}} />
            <Text style={{
              fontSize: 15,
              textAlign: 'center',
              fontWeight: '500',
              marginVertical: 20
            }}>{'No photo available'}</Text>
          </View>
        </View>
        <View style={{
          ...inlineStyles.gallerySection,
          flex: gallerySectionFlexRatio,
          display: this.state.photos.length>0 ? 'flex' : 'none'
        }}>
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

export default EditCommunityBanner;
