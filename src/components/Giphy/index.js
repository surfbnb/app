import React, { Component } from 'react';

import {
  View,
  Text,
  Alert,
  Modal,
  TouchableHighlight,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  Switch,
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
import TouchableButton from '../../theme/components/TouchableButton';
import { GiffyViewContext, CategoryViewContext, VCErrors, CATEGORY_VC_ID } from './view_contexts';
import GracefulImage from './GracefulImage';

class Giphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      isGifCategory: true,
      gifSearchQuery: '',
      gifsDataToShow: [],
      selectedImage: {}
    };

    this.screenWidth = Dimensions.get('window').width;
    this.handleGiphyPress.bind(this);
    this.viewContexts = {};
    this.currentViewContext = null;
    this.searchTimeout = 0;
  }

  isShowingCategory() {
    let currentViewContext = this.currentViewContext;
    return currentViewContext && currentViewContext.id == CATEGORY_VC_ID;
  }

  getCategoryListViewContext() {
    if (!this.viewContexts[CATEGORY_VC_ID]) {
      this.viewContexts[CATEGORY_VC_ID] = new CategoryViewContext();
    }
    return this.viewContexts[CATEGORY_VC_ID];
  }

  getTrendingViewContext(baseUrl, searchTerm) {
    let id = 'TRENDING_' + baseUrl + '_' + searchTerm;
    if (!this.viewContexts[id]) {
      this.viewContexts[id] = new GiffyViewContext(id, baseUrl);
    }
    return this.viewContexts[id];
  }

  getSearchViewContext(searchTerm) {
    let baseUrl = '/gifs/search';
    let id = 'SEARCH_' + baseUrl + '_' + searchTerm;
    if (!this.viewContexts[id]) {
      this.viewContexts[id] = new GiffyViewContext(id, baseUrl, searchTerm);
    }
    return this.viewContexts[id];
  }

  componentDidMount() {
    this.showCategotyList();
  }

  // region - Category List
  showCategotyList() {
    let viewContext = this.getCategoryListViewContext();
    this.showViewContext(viewContext);
  }
  // endregion

  // region - Search Term
  serchTermChanged(searchTerm) {
    this.setState({
      gifSearchQuery: searchTerm
    });

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.showSearchTerm(searchTerm);
    }, 300);
  }

  showSearchTerm(searchTerm) {
    if (!searchTerm || !searchTerm.length) {
      // Show Category.
      this.showCategotyList();
      return;
    }
    let viewContext = this.getSearchViewContext(searchTerm);
    this.showViewContext(viewContext);
  }
  // endregion

  // region - Show selected category/trending.
  showTrending(categoryData) {
    // Show viewContext.
    let url = categoryData['gifsUrl'];
    let searchTerm = categoryData['name'];
    let viewContext = this.getTrendingViewContext(url, searchTerm);
    this.showViewContext(viewContext);

    // Set the search term in the text box.
    this.setState({
      gifSearchQuery: searchTerm
    });
  }
  // endregion

  // region - show view context.
  showViewContext(viewContext) {
    console.log('showViewContext: entry');
    if (this.currentViewContext == viewContext) {
      console.log('showViewContext : Already showing viewContext with id', viewContext.id);
      return;
    }
    this.currentViewContext = viewContext;
    let results = viewContext.getAllResults();
    console.log('showViewContext: existing results.length:', results.length);
    if (results && results.length) {
      this.showResults(results, viewContext);
      this.scrollFlatListToTop();
      return;
    }

    if (viewContext.isFetching) {
      //Already fetching data.
      console.log('showViewContext: viewContext is already fetching data. id:', viewContext.id);
      return;
    }

    // Note: This is the right place to set state that shows 'loading' view.
    // And remove 'No Results' view if needed.

    return viewContext
      .fetch()
      .then((results) => {
        this.showResults(results, viewContext);
        this.scrollFlatListToTop();
        return results;
      })
      .catch((err) => {
        console.log('showViewContext: Something went wrong while calling fetch');
        console.log(err);
      });
  }

  showResults(results, viewContext) {
    let isGifCategory = viewContext.id == CATEGORY_VC_ID;
    if (this.currentViewContext != viewContext) {
      console.log('showResults: ignoring viewContext fetch. The viewContext has changed.');
      //ignore display;
      return;
    }
    console.log('Should show data for viewContext.id:', viewContext.id, 'results.length:', results.length);
    this.setState({ gifsDataToShow: results, isGifCategory: isGifCategory });

    // Note: This is right place to set state that shows 'No Results' view.
    // And remove 'loading' view if needed.
  }

  scrollFlatListToTop() {
    // Note: If app crashes. simply return from here.
    // iOS is know to crash when updating list views while scrolling.
    setTimeout(() => {
      if (this.listRef) {
        this.listRef.scrollToOffset({ x: 0, y: 0, animated: true });
      }
    }, 100);
  }
  // endregion

  loadMore() {
    let viewContext = this.currentViewContext;
    if (!viewContext || !viewContext.hasNextPage || viewContext.isFetching) {
      console.log('loadMore: call has been ignored.');
      if (!viewContext) {
        console.log('loadMore: currentViewContext is null');
      } else {
        console.log(
          'loadMore: viewContext.hasNextPage:',
          viewContext.hasNextPage,
          'viewContext.isFetching:',
          viewContext.isFetching
        );
      }
      // ignore.
      return;
    }

    viewContext
      .fetch()
      .then((resultsToAppend) => {
        if (this.currentViewContext != viewContext || !resultsToAppend || !resultsToAppend.length) {
          // ignore.
          return;
        }
        let existingResults = this.state.gifsDataToShow || [];
        let newResults = existingResults.concat(resultsToAppend);
        this.setState({ gifsDataToShow: newResults });
      })
      .catch((err) => {
        console.log('loadMore: Something went wrong. fetch threw an error');
        console.log(err);
      });
  }

  handleGiphyPress(data) {
    if (this.state.isGifCategory) {
      this.showTrending(data);
    } else if (!data.isCategory) {
      this.selectImage(data);
    }

    // Note: Added isCategory flag to data to avoid quick double taps on the image.
    // May be mergin 'gifs' with category is not a good idea.
  }

  selectImage(gifsData) {
    this.setState({
      selectedImage: gifsData,
      modalOpen: false
    });
    this.props.onGifySelect && this.props.onGifySelect(gifsData);
  }

  imgLoadStart(e, a, b, c) {
    console.log('imgLoadStart received.');
  }

  imgLoadEnd(e, a, b, c) {
    console.log('imgLoadEnd received.');
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
  };

  render() {
    let gifsData = this.state.gifsDataToShow,
      imageSelector,
      colWidth = (this.screenWidth - 62) / 3,
      screenWidth = this.screenWidth - 40,
      itemWidth = 200,
      ratio = colWidth / itemWidth,
      wh = itemWidth * ratio;

    if (Object.keys(this.state.selectedImage).length) {
      let ratioFullScreen = screenWidth / parseInt(this.state.selectedImage.downsized.width);
      imageSelector = (
        <ImageBackground
          source={{ uri: this.state.selectedImage.downsized.url }}
          style={{
            height: parseInt(this.state.selectedImage.downsized.height) * ratioFullScreen,
            width: parseInt(this.state.selectedImage.downsized.width) * ratioFullScreen,
            position: 'relative' // because it's parent
          }}
        >
          <Text
            style={{
              fontWeight: 'bold',
              color: 'black',
              position: 'absolute', // child
              top: 5, // position where you want
              right: 5
            }}
            onPress={() => this.setState({ selectedImage: {} })}
          >
            X
          </Text>
        </ImageBackground>
      );
    } else {
      imageSelector = (
        <TouchableOpacity
          onPress={() => {
            this.setState({
              modalOpen: true
            });
          }}
        >
          <View style={inlineStyles.giphyPicker}>
            <Image source={PlusIcon} style={inlineStyles.plusIcon} />
            <Text style={inlineStyles.giphyPickerText}> What do you want to GIF? </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <View>
        {imageSelector}

        {this.state.modalOpen && (
          <React.Fragment>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalOpen}
              onRequestClose={() => {
                this.setState({
                  modalOpen: false
                });
              }}
            >
              <TouchableWithoutFeedback
                onPressOut={() =>
                  this.setState({
                    modalOpen: false
                  })
                }
              >
                <View style={inlineStyles.modal}>
                  <View style={inlineStyles.modalInner}>
                    <FormInput
                      editable={true}
                      onChangeText={(gifSearchQuery) => this.serchTermChanged(gifSearchQuery)}
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

                    <FlatList
                      ref={(ref) => {
                        this.listRef = ref;
                      }}
                      contentContainerStyle={{
                        // flexWrap: 'wrap',
                        // flexDirection: 'row',
                        marginRight: 4
                      }}
                      onEndReached={() => {
                        console.log('On end reachedddd');
                        this.loadMore();
                      }}
                      data={gifsData}
                      renderItem={({ item }) => {
                        return (
                          <TouchableWithoutFeedback key={item.id} onPress={() => this.handleGiphyPress(item)}>
                            <View
                              style={[
                                {
                                  margin: 3,
                                  borderRadius: 4,
                                  backgroundColor: 'rgba(238,238,238,1)',
                                  overflow: 'hidden'
                                }
                              ]}
                            >
                              <GracefulImage
                                style={{
                                  width: wh,
                                  height: wh
                                }}
                                source={{ uri: item.fixed_width_downsampled.url }}
                              />
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
                                <Text style={inlineStyles.overlayText}>{item.name}</Text>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        );
                      }}
                      numColumns={3}
                      keyExtractor={(item, index) => index}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default Giphy;
