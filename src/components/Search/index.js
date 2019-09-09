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

  setSearchParams = (searchParams) => {
    this.setState({
      searchParams: searchParams ? encodeURIComponent(searchParams) : '',
      refresh: this.shouldMakeApiCall(searchParams)
    });
  };

  onRefresh = (result) => {
    let noResultsFound = result && result.length === 0;
    this.setState({
      refresh: false,
      noResultsFound
    });
  };

  shouldMakeApiCall = (searchParams) => {
    searchParams = searchParams || this.state.searchParams;
    if (searchParams && searchParams.length >= AppConfig.searchConfig.MIN_SEARCH_CHAR) {
      return true;
    }
    return false;
  };

  render() {
    return (
      <SearchResults
        fetchUrl={`/users/search?q=${this.state.searchParams}`}
        shouldMakeApiCall={this.shouldMakeApiCall}
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
