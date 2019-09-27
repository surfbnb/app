import React, { PureComponent } from 'react';
import { FlatList } from 'react-native';
import deepGet from 'lodash/get';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import HomeFeedRow from './HomeFeedRow';
import inlineStyles from './styles';

let currentIndex = 0;
const maxVideosThreshold = 3;

class VideoList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
    this.flatlistRef = null;
  }

  onViewableItemsChanged(data) {
    currentIndex = deepGet(data, 'viewableItems[0].index') || 0;
  }

  setActiveIndex() {
    if (this.state.activeIndex == currentIndex) return;
    this.setState({ activeIndex: currentIndex });
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return (
      <HomeFeedRow
        isActive={index == this.state.activeIndex}
        shouldPlay={this.props.shouldPlay}
        doRender={Math.abs(index - this.state.activeIndex) < maxVideosThreshold}
        feedId={item}
      />
    );
  };

  onMomentumScrollEndCallback = () => {
    this.setActiveIndex();
  };

  onScrollToTop = () => {
    this.setActiveIndex();
  };

  //This only is required for android,  as scroll to top or momentumscrollend callback are not getting iterscepted.
  //This code is only for Android. Need to debug it a bit more.
  forceSetActiveIndex( index=0 ){
    this.setState({ activeIndex: index });
  }

  render() {
    return (
      <FlatList
        extraData={this.state}
        snapToAlignment={'top'}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 90
        }}
        pagingEnabled={true}
        decelerationRate={'fast'}
        data={this.props.list}
        onEndReached={this.props.getNext}
        onRefresh={this.props.refresh}
        keyExtractor={this._keyExtractor}
        refreshing={this.props.refreshing}
        initialNumToRender={maxVideosThreshold}
        onEndReachedThreshold={7}
        style={inlineStyles.fullScreen}
        onViewableItemsChanged={this.onViewableItemsChanged}
        onMomentumScrollEnd={this.onMomentumScrollEndCallback}
        onMomentumScrollBegin={this.props.onMomentumScrollBeginCallback}
        renderItem={this._renderItem}
        showsVerticalScrollIndicator={false}
        onScrollToTop={this.onScrollToTop}
        ref={(ref) => (this.flatlistRef = ref)}
      />
    );
  }
}

export default flatlistHOC(VideoList, {
  scrollDetectNext: true
});
