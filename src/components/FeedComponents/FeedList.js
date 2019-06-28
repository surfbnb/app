import React, { Component } from 'react';
import { FlatList, View, Image, Text } from 'react-native';
import FeedRow from '../FeedComponents/FeedRow';
import EmptyFeedIcon from '../../assets/empty_feed_icon.png';
import inlineStyles from './styles';
import flatlistHOC from "../CommonComponents/flatlistHOC";

class FeedList extends Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          style={[this.props.style]}
          data={this.props.list}
          onEndReached={() => this.props.getNext()}
          onRefresh={() => this.props.refresh()}
          keyExtractor={(item, index) => `id_${item}`}
          onEndReachedThreshold={0.5}
          refreshing={this.props.refreshing}
          ListHeaderComponent={this.props.ListHeaderComponent ? this.props.ListHeaderComponent : <View></View>}
          ListFooterComponent={this.props.renderFooter}
          renderItem={({ item }) => <FeedRow id={item} userId={this.props.userId} />}
        ></FlatList>
        {this.props.list.length == 0 && !this.props.refreshing && (
          <View style={inlineStyles.emptyFeed}>
            <Image style={[inlineStyles.emptyFeedIconSkipFont]} source={EmptyFeedIcon}></Image>
            <Text style={inlineStyles.emptyFeedText}>Empty Feed.</Text>
            <Text style={inlineStyles.emptyFeedText}>Pepo your friends now</Text>
          </View>
        )}
      </View>
    );
  }
}

export default flatlistHOC( FeedList );
