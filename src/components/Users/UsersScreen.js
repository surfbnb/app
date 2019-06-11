import React, { Component } from 'react';
import { View, Text, FlatList } from 'react-native';

import PepoApi from '../../services/PepoApi';
import User from './User';
import styles from './styles';
import deepGet from 'lodash/get';

class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageIdentifier: ''
    };
  }

  componentDidMount() {
    this.getUsersData();
  }

  getUsersData = () => {
    let query_param = this.state.pageIdentifier,
      url = '/users';
    if (query_param) {
      url = url + `?pagination_identifier=${this.state.pageIdentifier}`;
    }
    
    let userFetch =  new PepoApi(url);
  
    userFetch
      .setNavigate(this.props.navigation.navigate)
      .get()
      .then((responseData) => {
        if (responseData && responseData.data) {
          console.log(responseData, 'users data');
          let pageIdentifier = deepGet(responseData, 'data.meta.next_page_payload.pagination_identifier');
          this.setState({
            pageIdentifier
          });
          let users = JSON.parse(JSON.stringify(this.props.users));
          this.props.dispatchUpsert(users.concat(responseData.data[responseData.data['result_type']]));
        }
      })
      .catch(console.warn)
      .done();
  };

  render() {
    if (this.props.users.length > 0) {
      return (
        <View style={styles.container}>
          <FlatList
            data={this.props.users}
            keyExtractor={(item, index) => String(item.id)}
            onEndReached={this.getUsersData}
            onEndReachedThreshold={0.2}
            renderItem={({ item }) => <User id={item.id} user={item} />}
          />
        </View>
      );
    }
    return <View></View>;
  }
}

export default Users;
