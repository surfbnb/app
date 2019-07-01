import React, { Component } from 'react';
import {ActivityIndicator} from "react-native";
import { FetchServices } from "../../services/FetchServices";

function flatlistHOC(ListComponent) {
    return class extends Component {
      constructor(props) {
        super(props);
        this.state = {
            list: [],
            refreshing: false,
            loadingNext: false
          };
      }
  
      componentDidMount() {
        if ( this.props.fetchUrl ) {
          this.initList( new FetchServices( this.props.fetchUrl ) );
        }
      }
    
      componentDidUpdate() {
        if (this.props.toRefresh) {
          this.refresh();
        }
      } 

      componentWillUnmount() {
        this.beforeNext = () => {};
        this.onNext = () => {};
        this.onNextError = () => {};
        this.beforeRefresh = () => {};
        this.onRefresh = () => {};
        this.onRefreshError = () => {};
      }
    
      initList( fetchServices ) {
        this.refresh( fetchServices );
      }
    
      refresh( fetchServices ) {
        if (this.state.refreshing) return;
        if( fetchServices ){
            this.fetchServices =  fetchServices ; 
        }else{
            this.fetchServices = this.fetchServices.clone();
        }
        this.beforeRefresh();
        this.fetchServices
          .refresh()
          .then((res) => {
            this.onRefresh(res);
          })
          .catch((error) => {
            this.onRefreshError(error);
          });
      }
    
      beforeRefresh() {
        console.log("refresh .........");
        this.props.beforeRefresh && this.props.beforeRefresh();
        this.setState({ refreshing: true });
      }
    
      onRefresh(res) {
        this.props.onRefresh && this.props.onRefresh(res);
        this.setState({ refreshing: false, list: this.fetchServices.getIDList() });
      }
    
      onRefreshError(error) {
        this.props.onRefreshError && this.props.onRefreshError(error);
        this.setState({ refreshing: false, list: this.fetchServices.getIDList() });
      }
    
      getNext = () => {
        if (this.state.loadingNext || this.state.refreshing) return;
        this.beforeNext();
        this.fetchServices
          .fetch()
          .then((res) => {
            this.onNext(res);
          })
          .catch((error) => {
            this.onNextError(error);
          });
      };
    
      beforeNext() {
        console.log("next .........");
        this.props.beforeNext && this.props.beforeNext();
        this.setState({ loadingNext: true });
      }
    
      onNext(res) {
        this.props.onNext && this.props.onNext(res);
        this.setState({ loadingNext: false, list: this.fetchServices.getIDList() });
      }
    
      onNextError(error) {
        this.props.onNextError && this.props.onNextError(error);
        this.setState({ loadingNext: false, list: this.fetchServices.getIDList() });
      }
    
      renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
      };
  
      render() {
        return <ListComponent
                list={this.state.list}
                getNext={() => this.getNext()}
                refresh={() => this.refresh()}
                refreshing={this.state.refreshing}
                renderFooter={()=> this.renderFooter()}
                {...this.props} />;
      }
    };
  }

  export default flatlistHOC 