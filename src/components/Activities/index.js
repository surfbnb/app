import React, { Component } from 'react';
import {View} from "react-native";
import FeedList from '../FeedComponents/FeedList';
import PepoApi  from "../../services/PepoApi";
import CurrentUser from '../../models/CurrentUser';


class Activities extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerTitle: 'Feed',
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    this.props.navigation.tab = 'Feed';


    new PepoApi("/activities")
        .get()
        .then((res) => {
          console.log("=====feed=====" , res);
        })
        .catch((error)=> {
          console.log("=====feed error=====" , error);
        })


    new PepoApi(`/users/${CurrentUser.getUserId()}/activities`)
      .get()
      .then((res) => {
        console.log("=====feed CurrentUser=====" , res);
      })
      .catch((error)=> {
        console.log("=====feed CurrentUser error=====" , error);
      })

  }

  render() {
    return <View></View>
  }
}

export default Activities;
