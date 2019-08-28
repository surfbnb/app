import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import Pricer from "../../services/Pricer";
import reduxGetters from "../../services/ReduxGetters";
import User from '../Users/User';
import EmptyList from '../EmptyFriendsList/EmptyList';

class SupportingList extends PureComponent {

  constructor(props) {
    super(props);
  }

  getBtAmount(fromUser , toUserId){
    return Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getUserContributionToStats(fromUser ,toUserId ) ) ) ;
  }
  
  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return <User  userId={item}  amount={this.getBtAmount(this.props.userId , item)}/>;
  };

  getEmptyComponent = () => {
    return !this.props.refreshing && (
        <EmptyList displayText="You are currently not supporting to anyone" />
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <FlatList
          data={this.props.list}
          onEndReached={this.props.getNext}
          onRefresh={this.props.refresh}
          keyExtractor={this._keyExtractor}
          refreshing={this.props.refreshing}
          onEndReachedThreshold={5}
          ListFooterComponent={this.props.renderFooter}
          ListEmptyComponent={this.getEmptyComponent}
          renderItem={this._renderItem}
        />  
      </View>
    );
  }
}

export default flatlistHOC(SupportingList);
