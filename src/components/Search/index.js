import React, { Component } from 'react';
import {Image, View, TextInput, TouchableOpacity, Text, FlatList} from 'react-native';


import styles from './styles';
import Theme from "../../theme/styles";
import AppConfig from "../../constants/AppConfig";
import {shortenedFromNow} from "../../helpers/timestampHandling";
import SearchResults from './SearchResults';


class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams : ''
    };
    this.setSearchParams = this.setSearchParams.bind(this);
  }

  setSearchParams(params){
    console.log('setSearchParams', params);
    this.setState({
      searchParams : params
    });
    // this.callSearch();
  }

  // callSearch = () =>{
  //   console.log(`/users/search?q=${this.state.searchParams}`);
  //   return(
  //     <SearchResults
  //       fetchUrl={this.state.searchParams ? `/users/search?q=${this.state.searchParams}` : ''}
  //       setSearchParams = {this.setSearchParams}
  //     />
  //   )
  // }


  render() {
    console.log(this.state.searchParams);
    return(
      <SearchResults
        fetchUrl={this.state.searchParams ? `/users/search?q=${this.state.searchParams}` : ''}
        setSearchParams = {this.setSearchParams}
      />
    )


  }
}

export default SearchScreen;
