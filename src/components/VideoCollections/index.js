import React, { PureComponent } from 'react';
import { ActivityIndicator, FlatList } from "react-native";
import {SafeAreaView, withNavigation} from "react-navigation";
import Pagination from "../../services/Pagination";
import {fetchUser} from "../../helpers/helpers";
import VideoThumbnailItem from '../../components/CommonComponents/VideoThumbnailItem';


class VideoCollections extends PureComponent {

    constructor(props){
        super(props);
        this.setPaginationInstance();
        this.paginationEvent = this.getPaginationInstance().event;

        this.state = {
            list :  this.getPaginationInstance().getResults(),
            refreshing : false,
            loadingNext: false
        };
        this.listRef = null;
    }


    componentDidMount(){
        this.paginationEvent.on("onBeforeRefresh" , this.beforeRefresh.bind(this) );
        this.paginationEvent.on("onRefresh" ,  this.onRefresh.bind(this) );
        this.paginationEvent.on("onRefreshError" , this.onRefreshError.bind(this));
        this.paginationEvent.on("onBeforeNext" , this.beforeNext.bind(this));
        this.paginationEvent.on("onNext" , this.onNext.bind(this) );
        this.paginationEvent.on("onNextError" , this.onNextError.bind(this));
        this.getPaginationInstance().initPagination();
    }

    componentWillUnmount(){
        this.paginationEvent.removeListener('onBeforeRefresh');
        this.paginationEvent.removeListener('onRefresh');
        this.paginationEvent.removeListener('onRefreshError');
        this.paginationEvent.removeListener('onBeforeNext');
        this.paginationEvent.removeListener('onNext');
        this.paginationEvent.removeListener('onNextError');
    }

    getBaseUrl(){
        return this.props.getBaseUrl();
    }


    setPaginationInstance(){
        this.videoPagination = new Pagination( this.getBaseUrl())
    }

    getPaginationInstance = () =>{
        return this.videoPagination;
    }

    onVideoClick = (payload, index) => {
        const clonedInstance = this.getPaginationInstance().fetchServices.cloneInstance();
        this.props.navigation.push("FullScreenVideoCollection", {
            fetchServices : clonedInstance,
            currentIndex: index,
            payload,
            baseUrl: this.getBaseUrl()
    });
    }

    beforeRefresh = () => {
        this.props.beforeRefresh && this.props.beforeRefresh();
        this.setState({ refreshing : true });
    }

    onRefresh = ( res ) => {
        const list = this.getPaginationInstance().getResults();
        this.props.onRefresh && this.props.onRefresh( list , res );
        this.setState({ refreshing : false , list : list });
    }

    onRefreshError = ( error ) => {
        this.setState({ refreshing : false });
    }

    beforeNext =() => {
        this.setState({ loadingNext : true });
    }

    onNext = ( res  ) => {
        this.setState({ loadingNext : false ,  list : this.getPaginationInstance().getResults() });
    }

    onNextError = ( error ) => {
        this.setState({ loadingNext : false });
    }

    getNext = () => {
        this.getPaginationInstance().getNext();
    }

    refresh = () => {
        this.getPaginationInstance().refresh();
    }


    _keyExtractor = (item, index) => `id_${item}`;

    _renderItem = ({ item, index }) => {
        return (<VideoThumbnailItem payload={item.payload} index={index} onVideoClick={() => {this.onVideoClick(item.payload, index)}} />);
    };

    renderFooter = () => {
        if (!this.state.loadingNext) return null;
        return <ActivityIndicator />;
    };


    listHeaderComponent = () => {
        return (
            <React.Fragment>
                {this.props.listHeaderComponent}
                {this.state.list.length > 0 && this.props.listHeaderSubComponent }
            </React.Fragment>
        )
    }

    render(){
        return (
            <SafeAreaView forceInset={{ top: 'never' }} style={{ flex: 1 }}>
                <FlatList
                    ref={(ref)=>  {this.listRef = ref } }
                    ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    onEndReached={this.getNext}
                    onRefresh={this.refresh}
                    keyExtractor={this._keyExtractor}
                    refreshing={this.state.refreshing}
                    onEndReachedThreshold={9}
                    renderItem={this._renderItem}
                    ListFooterComponent={this.renderFooter}
                    numColumns={2}
                />
            </SafeAreaView>
        );
    }

}

export default withNavigation(VideoCollections);
