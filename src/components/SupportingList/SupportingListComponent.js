import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import Pricer from "../../services/Pricer";
import reduxGetters from "../../services/ReduxGetters";
import EmptyList from '../EmptyFriendsList/EmptyList';
import CommonStyle from "../../theme/styles/Common";

import UserRow from '../CommonComponents/UserRow';
import SupportersSupportingUser from '../CommonComponents/UserRow/SupportersSupporting';

class SupportingList extends PureComponent {

  constructor(props) {
    super(props);
  }

  getBtAmount(fromUser , toUserId){
    return Pricer.getToBT( Pricer.getFromDecimal( reduxGetters.getUserContributionToStats(fromUser ,toUserId ) ) ) ;
  }
  
  _keyExtractor = (item, index) => `id_${item}`;

  _renderItem = ({ item, index }) => {
    return  <UserRow  userId={item} >
              <SupportersSupportingUser  userId={item}  amount={this.getBtAmount(this.props.userId , item)}/>
            </UserRow>
  };

  getEmptyComponent = () => {
    return !this.props.refreshing && (
        <EmptyList displayText="You are currently not supporting to anyone" />
    )
  }

  render() {
    return (
      <View style={CommonStyle.viewContainer}>
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
