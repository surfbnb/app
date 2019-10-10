import React, { PureComponent } from 'react';
import { FlatList, View, Text, ActivityIndicator, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-navigation';

import AppConfig from '../../constants/AppConfig';
import { connect } from 'react-redux';
import SearchComponent from './SearchComponent';
import CurrentUser from '../../models/CurrentUser';
import { Container, Header, Tab, Tabs, ScrollableTab } from 'native-base';
import UserProfileFlatList from '../CommonComponents/UserProfileFlatList';
import SearchListHeader from "./SearchListHeader";
import styles from './styles';


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
      searchParams: 'ash',
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
      <SafeAreaView style={styles.container}>
          <Container>  
            <Header hasTabs>
              <SearchListHeader />
            </Header>
            <Tabs renderTabBar={()=> <ScrollableTab />}>
              <Tab heading="Tab1">
                <FlatList  
                      data={[  
                          {key: 'Android'},{key: 'iOS'}, {key: 'Java'},{key: 'Swift'},  
                          {key: 'Php'},{key: 'Hadoop'},{key: 'Sap'},  
                          {key: 'Python'},{key: 'Ajax'}, {key: 'C++'},  
                          {key: 'Ruby'},{key: 'Rails'},{key: '.Net'},  
                          {key: 'Perl'},{key: 'Sap'},{key: 'Python'},  
                          {key: 'Ajax'}, {key: 'C++'},{key: 'Ruby'},  
                          {key: 'Rails'},{key: '.Net'},{key: 'Perl'} 
                      ]}  
                      renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}     
                  />  
              </Tab>
              <Tab heading="Tab2asdasdsaada">
                <UserProfileFlatList userId={"1710"}/>
              </Tab>
              <Tab heading="Tab3">
              <FlatList  
                    data={[  
                        {key: 'Android'},{key: 'iOS'}, {key: 'Java'},{key: 'Swift'},  
                        {key: 'Php'},{key: 'Hadoop'},{key: 'Sap'},  
                        {key: 'Python'},{key: 'Ajax'}, {key: 'C++'},  
                        {key: 'Ruby'},{key: 'Rails'},{key: '.Net'},  
                        {key: 'Perl'},{key: 'Sap'},{key: 'Python'},  
                        {key: 'Ajax'}, {key: 'C++'},{key: 'Ruby'},  
                        {key: 'Rails'},{key: '.Net'},{key: 'Perl'}  
                    ]}  
                    renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}                    
                />  
              </Tab>
              <Tab heading="Tabdddasdsa4">
              <FlatList  
                    data={[  
                        {key: 'Android'},{key: 'iOS'}, {key: 'Java'},{key: 'Swift'},  
                        {key: 'Php'},{key: 'Hadoop'},{key: 'Sap'},  
                        {key: 'Python'},{key: 'Ajax'}, {key: 'C++'},  
                        {key: 'Ruby'},{key: 'Rails'},{key: '.Net'},  
                        {key: 'Perl'},{key: 'Sap'},{key: 'Python'},  
                        {key: 'Ajax'}, {key: 'C++'},{key: 'Ruby'},  
                        {key: 'Rails'},{key: '.Net'},{key: 'Perl'}  
                    ]}  
                    renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}     
                />  
              </Tab>
              <Tab heading="Tab5">
              <FlatList  
                    data={[  
                        {key: 'Android'},{key: 'iOS'}, {key: 'Java'},{key: 'Swift'},  
                        {key: 'Php'},{key: 'Hadoop'},{key: 'Sap'},  
                        {key: 'Python'},{key: 'Ajax'}, {key: 'C++'},  
                        {key: 'Ruby'},{key: 'Rails'},{key: '.Net'},  
                        {key: 'Perl'},{key: 'Sap'},{key: 'Python'},  
                        {key: 'Ajax'}, {key: 'C++'},{key: 'Ruby'},  
                        {key: 'Rails'},{key: '.Net'},{key: 'Perl'}  
                    ]}  
                    renderItem={({item}) => <Text style={styles.item}>{item.key}</Text>}  
                />  
              </Tab>
            </Tabs>
      </Container>
    </SafeAreaView>  
    );
  }
}

export default connect(mapStateToProps)(SearchScreen);