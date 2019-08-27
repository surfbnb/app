import React, { Component } from 'react';
import SearchResults from './SearchResults';

class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchParams: null,
      refresh: true
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

  onRefresh = () => {
    this.setState({
      refresh: false
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
      />
    );
  }
}

export default SearchScreen;
