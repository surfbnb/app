import React from 'react';
import { FlatList, View, Image, Text } from 'react-native';
import FeedRow from '../FeedComponents/FeedRow';
import EmptyFeedIcon from '../../assets/empty_feed_icon.png';
import inlineStyles from './styles';
import flatlistHOC from "../CommonComponents/flatlistHOC";

const FeedList = (props) => (
    <View style={{ flex: 1 }}>
        <FlatList
          style={[props.style]}
          data={props.list}
          onEndReached={() => props.getNext()}
          onRefresh={() => props.refresh()}
          keyExtractor={(item, index) => `id_${item}`}
          refreshing={props.refreshing}
          onEndReachedThreshold={5}
          ListHeaderComponent={props.ListHeaderComponent ? props.ListHeaderComponent : <View></View>}
          ListFooterComponent={props.renderFooter}
          renderItem={({ item }) => <FeedRow id={item} userId={props.userId} />}
        ></FlatList>
        {props.list.length == 0 && !props.refreshing && (
          <View style={inlineStyles.emptyFeed}>
            <Image style={[inlineStyles.emptyFeedIconSkipFont]} source={EmptyFeedIcon}></Image>
            <Text style={inlineStyles.emptyFeedText}>Empty Feed.</Text>
            <Text style={inlineStyles.emptyFeedText}>Pepo your friends now</Text>
          </View>
        )}
    </View>
);

export default flatlistHOC( FeedList );
