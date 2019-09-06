import React, { Component } from 'react';

import SearchResults from './SearchResults';
import AppConfig from '../../constants/AppConfig';

class SearchScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };
  constructor(props) {
    super(props);
    this.state = {
      searchParams: null,
      refresh: true,
      noResultsFound: false
    };
  }

  setSearchParams = (searchText) => {
    let queryParams = '';
    if (searchText && searchText.length >= AppConfig.searchConfig.MIN_SEARCH_CHAR) {
      queryParams = searchText;
    } else {
      queryParams = null;
    }
    this.setState({
      searchParams: queryParams,
      refresh: true
    });
  };

  onRefresh = (result) => {
    let noResultsFound = result && result.length === 0;
    this.setState({
      refresh: false,
      noResultsFound
    });
  };

  render() {
    return (
      <SearchResults
        fetchUrl={`/users/search?q=${this.state.searchParams}`}
        setSearchParams={this.setSearchParams}
        onRefresh={this.onRefresh}
        toRefresh={this.state.refresh}
        searchParams={this.state.searchParams}
        noResultsFound={this.state.noResultsFound}
      />
    );
  }
}

export default SearchScreen;
