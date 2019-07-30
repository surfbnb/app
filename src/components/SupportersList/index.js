import React, { PureComponent } from 'react';
import { FlatList, Dimensions } from 'react-native';
import deepGet from 'lodash/get';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import User from '../Users/User';
import EmptyList from '../EmptyFriendsList/EmptyList';


class SupportersList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeIndex: 0
    };
  }



  setActiveIndex() {
    if (this.state.activeIndex == currentIndex) return;
    this.setState({ activeIndex: currentIndex });
  }

  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User id={item} />;
  };


  //TODO empty list only visible when no data and not refreshing.
  render() {
    return this.props.list.length > 0 ? (
      <FlatList

        data={this.props.list}
        onEndReached={this.props.getNext}
        onRefresh={this.props.refresh}
        keyExtractor={this._keyExtractor}
        refreshing={this.props.refreshing}
        onEndReachedThreshold={5}
        ListFooterComponent={this.props.renderFooter} 
        renderItem={this._renderItem}
      />
    ) : <EmptyList displayText='You are currently do not have any supporters' />;
  }
}

export default flatlistHOC(SupportersList);
