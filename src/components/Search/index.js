import React, { Component } from 'react';
import SearchResults from './SearchResults';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: null,
      refresh: true,
      resultsFound: true
    };
  }

  setSearchParams = (searchText) => {
    let queryParams = '';
    if (searchText && searchText.length >= 3) {
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
    let resultsFound = result && result.length > 0;
    this.setState({
      refresh: false,
      resultsFound
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
        resultsFound={this.state.resultsFound}
      />
    );
  }
}

export default SearchScreen;
