import React, { Component } from 'react';
import { FlatList , View } from 'react-native';
import FeedRow from '../FeedComponents/FeedRow';
import {FetchComponent} from "../FetchComponent";

class FeedList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds : [],
      refreshing : false,
      progressViewOffset: 0
    }
    this.loadingNext = false;
    if( this.props.fetchUrl ){
        this.fetchComponent = new FetchComponent(this.props.fetchUrl);
    }
  }

  componentDidMount() {
    if(!this.fetchComponent) return;
    this.initList();
  }

  componentWillUnmount(){
    this.fetchComponent = null;
  }

  initList(){
    this.refresh();
  }

  refresh(){
    this.beforeRefresh();
    if( this.state.refreshing ) return ;
    this.setState({ refreshing  : true  });
    this.fetchComponent
    .refresh()
    .then( ( res) => {
      this.setState({ refreshing  : false , feeds : this.fetchComponent.getIDList() });
      this.onRefresh( res );
    })
    .catch((error)=>{
      this.setState({ refreshing  : false  });
      this.onRefreshError(error);
    });
  }

  beforeRefresh(){
    this.props.beforeRefresh && this.props.beforeRefresh();
  }

  onRefresh( res ){
    this.props.onRefresh && this.props.onRefresh( res );
  }

  onRefreshError( error ){
    this.props.onRefreshError && this.props.onRefreshError( error );
  }

  getNext = () => {
    if(this.loadingNext) return ;
    this.beforeNext();
    this.fetchComponent
      .fetch()
      .then(( res ) => {
        this.onNext( res );
        this.setState( {feeds : this.fetchComponent.getIDList() })
      })
      .catch((error) => {
        this.onNextError( error );
        console.log("getFeedList error" , error);
      })
  };

  beforeNext(){
    this.loadingNext = true;
    this.props.beforeNext && this.props.beforeNext();
  }

  onNext( res ){
    this.loadingNext = false;
    this.props.onNext && this.props.onNext( res );
  }

  onNextError(error){
    this.loadingNext = false;
    this.props.onNextError && this.props.onNextError(error);
  }

  render() {
      return (
          <FlatList
            data={this.state.feeds}
            onEndReached={this.getNext}
            onRefresh={()=>{this.refresh()}}
            keyExtractor={(item, index) => `id_${item}`}
            onEndReachedThreshold={0.5}
            initialNumToRender={20}
            refreshing={this.state.refreshing}
            progressViewOffset={this.state.progressViewOffset}
            ListHeaderComponent={this.props.ListHeaderComponent ? this.props.ListHeaderComponent : <View></View>}
            renderItem={({ item }) => (
                <FeedRow id={item} />
            )}
          />
      );
  }
}

export default FeedList;
