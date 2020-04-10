import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import EmptySearchResult from '../CommonComponents/EmptySearchResult';
import CommonStyle from "../../theme/styles/Common";
import UserRow from '../CommonComponents/UserRow';
import AmdinUser from "../CommonComponents/UserRow/Admin";

class MembersList extends PureComponent {
  constructor(props) {
    super(props);
  }

  _keyExtractor = (item, index) => `id_${item}_${index}`;

  _renderItem = ({ item, index }) => {
    return <UserRow userId={item} >
              <AmdinUser  userId={item} channelId={this.props.channelId} />
          </UserRow>
  };

  getEmptyComponent = () => {
        const noResultsData = {
            "noResultsMsg":`No members found.`,
            "isEmpty": true
        };
        return !this.props.refreshing && <EmptySearchResult noResultsData={noResultsData}/>
  };

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
          ListEmptyComponent={this.getEmptyComponent}
          ListFooterComponent={this.props.renderFooter}
          renderItem={this._renderItem}
        />
      </View>
    );
  }
}

export default flatlistHOC(MembersList);
