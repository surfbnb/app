import React, { PureComponent } from 'react';
import { FlatList, View, Image, Text } from 'react-native';
import ActivityRow from './ActivityRow';
import EmptyFeedIcon from '../../assets/empty_feed_icon.png';
import inlineStyles from './styles';
import flatlistHOC from "../CommonComponents/flatlistHOC";


class ActivityList extends PureComponent {

  constructor(props){
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}` ;

  _renderItem = ({item, index}) => { return ( <ActivityRow id={item}  />)};  

  render(){
    return (
      <View style={{ flex: 1 }}>
        <FlatList data={this.props.list}
                onEndReached={this.props.getNext}
                onRefresh={this.props.refresh}
                refreshing={this.props.refreshing}
                onEndReachedThreshold={5}
                style={[this.props.style]}
                //onMomentumScrollBegin={this.props.onMomentumScrollBeginCallback}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}      
                ListFooterComponent={this.props.renderFooter}         
        ></FlatList>
        { this.props.list && this.props.list.length == 0 && !this.props.refreshing && (
          <View style={inlineStyles.emptyFeed}>
            <Image style={[inlineStyles.emptyFeedIconSkipFont]} source={EmptyFeedIcon}></Image>
            <Text style={inlineStyles.emptyFeedText}>Empty Feed.</Text>
            <Text style={inlineStyles.emptyFeedText}>Pepo your friends now</Text>
          </View>
        )}
      </View>
    )
  }
}

export default flatlistHOC( ActivityList );
