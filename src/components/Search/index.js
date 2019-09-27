import React, { PureComponent } from 'react';

import AppConfig from '../../constants/AppConfig';
import { connect } from 'react-redux';
import SearchComponent from './SearchComponent';
import CurrentUser from '../../models/CurrentUser';

const mapStateToProps = (state) => {
  return {
    userId: CurrentUser.getUserId()
  };
};

class SearchScreen extends PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      header: null,
      headerBackTitle: null
    };
  };
  constructor(props) {
    super(props);
    this.defaultState =  {
      searchParams: '',
      refresh: true,
      noResultsFound: false
    };
    this.state = this.defaultState;
  }

  componentDidUpdate(){
    if(!this.props.userId){
      this.setState({...this.defaultState});
    }
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
    if(searchParams == "") return true;
    searchParams = searchParams || this.state.searchParams;
    if (searchParams.length == 1) {
      return false;
    }
    return true;
  };

  render() {
    return this.props.userId && (
      <SearchComponent
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

export default connect(mapStateToProps)(SearchScreen);