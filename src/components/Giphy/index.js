import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableHighlight,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions,
  ScrollView,
  FlatList
} from 'react-native';
import inlineStyles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import deepGet from 'lodash/get';
import FormInput from '../../theme/components/FormInput';
import PepoApi from '../../services/PepoApi';
import PlusIcon from '../../assets/plus_icon.png';
import Theme from '../../theme/styles';

class Giphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      gifSearchQuery: '',
      gifsCategoryMetaData: [],
      gifsCategoryData: {},
      gifsDataToShow: [],
      isGifCategory: true,
      selectedImage: {},
      gifUrl: ''
    };
    this.screenWidth = Dimensions.get('window').width;
    this.nextPagePayload = {};
    this.isFetching = false;
  }

  componentDidMount() {
    this.getGiphyCategotyData();
  }

  getGiphyCategotyData() {
    let gifApi = new PepoApi('/gifs/categories');
    gifApi
      // .setNavigate(this.props.navigation.navigate)
      .get()
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            gifsCategoryMetaData = deepGet(res, 'data.' + resultType),
            gifsCategoryData = deepGet(res, 'data.gifs');
          this.setState({
            gifsCategoryMetaData,
            gifsCategoryData
          });
          this.genereateGifDataToShow();
        }
      });
  }

  genereateGifDataToShow() {
    let gifsDataToShow = [],
      gifsCategoryMetaData = this.state.gifsCategoryMetaData,
      gifsCategoryData = this.state.gifsCategoryData;
    this.setState({ gifsDataToShow: [] });
    for (let i = 0; i < gifsCategoryMetaData.length; i++) {
      let gifId = gifsCategoryMetaData[i]['gif_id'];
      gifsDataToShow.push({
        ...gifsCategoryData[gifId],
        ...{ gifsUrl: gifsCategoryMetaData[i]['url'], name: gifsCategoryMetaData[i]['name'] }
      });
    }
    this.setState({ gifsDataToShow, isGifCategory: true });
  }

  giphyPickerHandler() {
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  searchGiphy(gifSearchQuery, gifUrl = '') {
    this.setState({
      gifSearchQuery,
      gifUrl
    });
    let gifurl = gifUrl || '/gifs/search',
      gifQuery = gifUrl ? this.nextPagePayload : { ...{ query: gifSearchQuery }, ...this.nextPagePayload };
    if (gifSearchQuery) {
      if (this.isFetching || this.nextPagePayload === null) return;

      if (this.lastPagePayload && this.lastPagePayload === JSON.stringify(this.nextPagePayload)) return;

      this.isFetching = true;

      // copy this.nextPagePayload -> this.lastPagePayload
      this.lastPagePayload = JSON.stringify(this.nextPagePayload);

      let gifApi = new PepoApi(gifurl);
      var oThis = this;

      gifApi
        // .setNavigate(this.props.navigation.navigate)
        .get(gifQuery)
        .then((res) => {
          if (res.success && res.data) {
            let resultType = deepGet(res, 'data.result_type'),
              gifsDataToShow = deepGet(res, 'data.' + resultType);
            this.nextPagePayload = deepGet(res, 'data.meta.next_page_payload');

            let gifsData = this.state.isGifCategory
              ? [...gifsDataToShow]
              : [...this.state.gifsDataToShow, ...gifsDataToShow];

            oThis.setState({
              gifsDataToShow: gifsData,
              isGifCategory: false
            });
          }
        })
        .catch(console.warn)
        .done(() => {
          this.isFetching = false;
        });
    } else {
      this.genereateGifDataToShow();
    }
  }

  handleGiphyPress(gifsData) {
    return () => {
      if (this.state.isGifCategory) {
        this.searchGiphy(gifsData['name'], gifsData['gifsUrl']);
      } else {
        this.selectImage(gifsData);
      }
    };
  }

  selectImage(gifsData) {
    this.closeModal();
    this.setState({
      selectedImage: gifsData
    });
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  render() {
    let elements = [];
    let gifsData = this.state.gifsDataToShow;
    let imageSelector;

    let colWidth = (this.screenWidth - 62) / 3;
    let itemWidth = 200;
    let ratio = colWidth / itemWidth;
    let wh = itemWidth * ratio;

    if (Object.keys(this.state.selectedImage).length) {

      imageSelector = (
        <View>
          {/* <Text onClick={this.setState({ selectedImage: {} })}>X</Text> */}
          <Image
            style={{
              width: parseInt(this.state.selectedImage.downsized.width),
              height: parseInt(this.state.selectedImage.downsized.height)
            }}
            source={{ uri: this.state.selectedImage.downsized.url }}
          />
        </View>
      );
    } else {
      imageSelector = (
        <View style={inlineStyles.giphyPicker}>
          <Image source={PlusIcon} style={inlineStyles.plusIcon} />
          <Text style={inlineStyles.giphyPickerText}> What do you want to GIF? </Text>
        </View>
      );
    }

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.giphyPickerHandler();
          }}
        >
          {imageSelector}
        </TouchableOpacity>
        {this.state.modalOpen && (
          <React.Fragment>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.closeModal();
              }}
            >
              <View style={inlineStyles.modal}>
                <View style={inlineStyles.modalInner}>
                  <FormInput
                    editable={true}
                    onChangeText={(gifSearchQuery) => this.searchGiphy(gifSearchQuery)}
                    fieldName="gif_category_search_query"
                    textContentType="none"
                    value={this.state.gifSearchQuery}
                    style={[Theme.TextInput.textInputStyle]}
                    placeholder="Search Giphy"
                    returnKeyType="next"
                    returnKeyLabel="next"
                    placeholderTextColor="#ababab"
                    errorHandler={(fieldName) => {
                      this.ServerErrorHandler(fieldName);
                    }}
                  />

                  <ScrollView
                    contentContainerStyle={{
                      flexWrap: 'wrap',
                      flexDirection: 'row',
                      marginRight: 4
                    }}
                    onScroll={({ nativeEvent }) => {
                      if (this.isCloseToBottom(nativeEvent)) {
                        !this.state.isGifCategory && this.searchGiphy(this.state.gifSearchQuery, this.state.gifUrl);
                      }
                    }}
                    scrollEventThrottle={400}
                  >
                    {gifsData.map((gif, i) => (
                      <TouchableWithoutFeedback key={i} data-key={i} onPress={this.handleGiphyPress(gif)}>
                        <View>
                          <Image
                            style={{
                              width: wh,
                              height: wh,
                              margin: 3,
                              borderRadius: 4
                            }}
                            source={{ uri: gif.fixed_width_downsampled.url }}
                          ></Image>
                          <View
                            style={[
                              inlineStyles.overlay,
                              {
                                backgroundColor: this.state.isGifCategory ? 'rgba(0,0,0,0.75)' : 'rgba(0,0,0,0)',
                                height: wh,
                                width: wh
                              }
                            ]}
                          >
                            <Text style={inlineStyles.overlayText}>{gif.name}</Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </Modal>
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default Giphy;
