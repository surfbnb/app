import React, { Component } from 'react';

import {
  View,
  Text,
  Modal,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
  Dimensions,
  TextInput,
  ScrollView,
  FlatList,
  ActivityIndicator
} from 'react-native';

import inlineStyles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import PlusIcon from '../../assets/plus_icon.png';
import CrossIcon from '../../assets/cross_icon.png';
import Theme from '../../theme/styles';
import { CategoryViewContext, CATEGORY_VC_ID } from './view_contexts';
import GracefulImage from './GracefulImage';
import { FetchServices } from '../../services/FetchServices';
import CircleCloseIcon from '../../assets/circle_close_icon.png';

const removeSearchDuplicateGiphy = false;

class Giphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      isGifCategory: true,
      gifSearchQuery: '',
      gifsDataToShow: [],
      selectedImage: {},
      isRefreshing: false,
      isLoadingMore: false
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
      this.viewContexts[id] = new FetchServices(baseUrl, {}, id, { removeDuplicate: removeSearchDuplicateGiphy });
    }
    return this.viewContexts[id];
  }

  getSearchViewContext(searchTerm) {
    let baseUrl = '/gifs/search';
    let id = 'SEARCH_' + baseUrl + '_' + searchTerm;
    if (!this.viewContexts[id]) {
      this.viewContexts[id] = new FetchServices(baseUrl, { query: searchTerm }, id, {
        removeDuplicate: removeSearchDuplicateGiphy
      });
    }
    return this.viewContexts[id];
  }

  componentDidMount() {
    this.showCategotyList();
  }

  // region - Category List
  showCategotyList() {
    this.setState({
      gifSearchQuery: ''
    });
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

    // Show pull to refresh loader.
    this.setState({
      isRefreshing: true
    });
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
      })
      .done(() => {
        // Hide pull to refresh loader.
        this.setState({
          isRefreshing: false
        });
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

    // Show load more loader.
    this.setState({
      isLoadingMore: true
    });
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
      })
      .done(() => {
        this.setState({
          isLoadingMore: false
        });
      });
  }
  renderFooter() {
    //it will show indicator at the bottom of the list when data is loading otherwise it returns null
    if (!this.state.isLoadingMore) return null;
    return <ActivityIndicator style={{ color: '#000' }} />;
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

  refreshFlatList() {
    if (this.state.isRefreshing) {
      // Ignore.
      return;
    }

    let viewContext;
    let currentViewContext = this.currentViewContext;
    let currentResults = currentViewContext.getAllResults();

    // Bug Prone Area Begins.
    if (!currentResults || !currentResults.length) {
      // The currentViewContext has not been used yet. let's not create a new one.
      viewContext = currentViewContext;
    } else {
      //Clone and update our books.
      viewContext = this.currentViewContext.clone();

      this.viewContexts[viewContext.id] = viewContext;
      console.log('viewContext with id:', viewContext.id, 'has been cloned and reassigned.');
    }
    // Bug Prone Area Ends.

    this.showViewContext(viewContext);
  }

  render() {
    let gifsData = this.state.gifsDataToShow,
      imageSelector,
      colWidth = (this.screenWidth - 62) / 3,
      screenWidth = this.screenWidth - 40,
      itemWidth = 200,
      ratio = colWidth / itemWidth,
      wh = itemWidth * ratio,
      showCloseIcon = this.state.gifSearchQuery ? true : false;

    if (Object.keys(this.state.selectedImage).length) {
      imageSelector = (
        <View
          style={[
            {
              backgroundColor: 'rgba(238,238,238,1)'
            }
          ]}
        >
          <ActivityIndicator style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0
          }}/>
          <ImageBackground
            source={{ uri: this.state.selectedImage.downsized.url }}
            style={{
              width: '100%',
              aspectRatio:
                parseInt(this.state.selectedImage.downsized.width) /
                parseInt(this.state.selectedImage.downsized.height),
              position: 'relative' // because it's parent
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.setState({ selectedImage: {} })}>
              <Image source={CircleCloseIcon} style={[inlineStyles.crossIconSkipFont, { top: 5, right: 5 }]} />
            </TouchableWithoutFeedback>
          </ImageBackground>
        </View>
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
            <Image source={PlusIcon} style={inlineStyles.plusIconSkipFont} />
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
              <ScrollView nestedScrollEnabled={true}>
                <TouchableWithoutFeedback
                  onPressOut={() =>
                    this.setState({
                      modalOpen: false
                    })
                  }
                >
                  <View style={inlineStyles.modal}>
                    <TouchableWithoutFeedback>
                      <View style={inlineStyles.modalInner}>
                        <View style={{ position: 'relative' }}>
                          <TextInput
                            editable={true}
                            onChangeText={(gifSearchQuery) => this.serchTermChanged(gifSearchQuery)}
                            ref="gif_category_search_query"
                            textContentType="none"
                            value={this.state.gifSearchQuery}
                            style={[Theme.TextInput.textInputStyle, { marginBottom: 10 }]}
                            placeholder="Search Giphy"
                            returnKeyType="next"
                            returnKeyLabel="next"
                            placeholderTextColor="#ababab"
                            errorHandler={(fieldName) => {
                              this.ServerErrorHandler(fieldName);
                            }}
                          />
                          {(showCloseIcon && (
                            <TouchableWithoutFeedback
                              onPress={() => {
                                this.showCategotyList();
                              }}
                            ><Image source={CrossIcon} style={inlineStyles.crossIconSkipFont} />

                            </TouchableWithoutFeedback>
                          )) ||
                            null}
                        </View>

                        <FlatList
                          nestedScrollEnabled={true}
                          removeClippedSubviews={true}
                          ref={(ref) => {
                            this.listRef = ref;
                          }}
                          contentContainerStyle={{
                            // flexWrap: 'wrap',
                            // flexDirection: 'row',
                            marginRight: 4
                          }}
                          onEndReached={() => {
                            this.loadMore();
                          }}
                          refreshing={this.state.isRefreshing}
                          onRefresh={() => {
                            this.refreshFlatList();
                          }}
                          onEndReachedThreshold={0.7}
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
                                        backgroundColor: this.state.isGifCategory ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0)',
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
                          ListFooterComponent={this.renderFooter.bind(this)}
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </TouchableWithoutFeedback>
              </ScrollView>
            </Modal>
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default Giphy;
