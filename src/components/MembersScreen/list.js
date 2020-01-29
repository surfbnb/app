import React, { PureComponent } from 'react';
import { FlatList, View } from 'react-native';
import flatlistHOC from '../CommonComponents/flatlistHOC';
import EmptySearchResult from '../CommonComponents/EmptySearchResult';
import CommonStyle from "../../theme/styles/Common";
import UserRow from '../CommonComponents/UserRow';
import ReduxGetters from '../../services/ReduxGetters';
import inlineStyles from "./styles";

class SupportersList extends PureComponent {
  constructor(props) {
    super(props);
  }
  
  _keyExtractor = (item, index) => `id_${item}_${index}`;

  _renderItem = ({ item, index }) => {
    return <UserRow userId={item} leftLabel={this.getLeftLabel(item)} />;
  };

  getLeftLabel = (item) =>{
    if(ReduxGetters.isChannelUserAdmin(this.props.channelId , item )){
        return <View style={inlineStyles.leafInnerWrapper}><Text style={inlineStyles.leafInnerText}>Admin</Text></View>
    }else{
        return null;
    }
  }

  getEmptyComponent = () => {
        const noResultsData = {
            "noResultsMsg":`No members found, Please try again later.`,
            "isEmpty": true
        };
        return !!this.props.refreshing && <EmptySearchResult noResultsData={noResultsData}/>
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

export default flatlistHOC(SupportersList);
