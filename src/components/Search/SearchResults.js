import React , {Component} from 'react';
import {Text,View,FlatList,Image} from 'react-native';
import { SafeAreaView } from 'react-navigation';

import styles from './styles';
import Theme from "../../theme/styles";
import User from './User';
import ProfilePicture from "../ProfilePicture";
import SearchListHeader from './SearchListHeader';
import PepoPinkIcon from "../../assets/heart.png";
import FlatListHoc from '../CommonComponents/flatlistHOC'


class SearchResults extends Component {
  constructor(props){
    super(props);
  }

  _keyEctractor = ({item,index}) => {
    return item.id;
  }

  _renderItem = ({item,index}) =>{
    return (
      <User
        userId={item}
      />)

  }

  render(){
    return(
      <SafeAreaView style={styles.container}>
        <FlatList
          data={this.props.list}
          onEndReached={this.props.getNext}
          onRefresh={this.props.refresh}
          refreshing={this.props.refreshing}
          onEndReachedThreshold={5}
          renderItem={this._renderItem}
          ListHeaderComponent={<SearchListHeader setSearchParams={this.props.setSearchParams}/> }
        />


      </SafeAreaView>

    )
  }

}

export default FlatListHoc(SearchResults, {
  keyPath: 'payload.user_id'
});