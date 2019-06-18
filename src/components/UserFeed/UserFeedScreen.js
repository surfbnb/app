import React, { Component} from 'react';
import {Image} from 'react-native';
import FeedList from "../FeedComponents/FeedList";
import BackArrow from '../../assets/back-arrow.png';

class UserFeedScreen extends Component {

  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
        headerTitle: navigation.getParam('headerText'),
        headerBackTitle: null,
        headerBackImage: <Image source={BackArrow} style={{ width: 10, height: 18, marginLeft: 8 }} />
    };
  };

  constructor(props) {
    super(props);
    const userId = this.props.navigation && this.props.navigation.getParam('userId'); 
    if( !userId ) return ;
    this.fetchUrl = `/users/${userId}/feeds`;
  }

  render() {
      return (
        <FeedList fetchUrl={this.fetchUrl} ></FeedList>
      );
  }
}

export default UserFeedScreen;