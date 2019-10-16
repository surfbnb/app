import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {  View  } from 'react-native';
import CurrentUser from '../../models/CurrentUser';
import reduxGetter from '../../services/ReduxGetters';
import VideoCollections from '../VideoCollections';
import Colors from '../../theme/styles/Colors';
import NavigationEmitter from '../../helpers/TabNavigationEvent';
import PepoApi from "../../services/PepoApi";
import deepGet from 'lodash/get';
import EmptySearchResult from '../../components/CommonComponents/EmptySearchResult';



class VideoTags extends PureComponent {
    static navigationOptions = (options) => {
        const name = options.navigation.getParam('headerTitle');
        return {
            headerBackTitle: null,
           title: name && `#${name}`,
            headerTitleStyle: {
                fontFamily: 'AvenirNext-Medium'
            },
            headerStyle: {
                backgroundColor: Colors.white,
                borderBottomWidth: 0,
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 1
                },
                shadowOpacity: 0.1,
                shadowRadius: 3
            }
        };
    };

    constructor(props) {
        super(props);
        this.noResultsData = {
            "noResultsMsg": 'No results found. Please try again.',
            "isEmpty": true
        };
    }

    componentDidMount() {

        this.didFocus = this.props.navigation.addListener('didFocus', (payload) => {
            let hashTag = reduxGetter.getHashTag(this.getTagId());
            hashTag && this.props.navigation.setParams({ headerTitle: hashTag.text });
            this.getTagData();
        });
    }

    getTagData = () =>{
        new PepoApi(`/tags/${this.getTagId()}`)
            .get()
            .then((res)=>{
                if (res && res.success){
                    this.props.navigation.setParams({ headerTitle: deepGet(res, 'data.tag.text') });
                }
            })
    }

    componentWillUnmount() {
        NavigationEmitter.removeListener('onRefresh');
        this.didFocus && this.didFocus.remove && this.didFocus.remove();
    }



    _headerComponent() {
        // do nothing
    }

    getFetchUrl = () => {
        return `/tags/${this.getTagId()}/videos`

    }

    getTagId = () => {
        return this.props.navigation.getParam("tagId")
    }

    renderNoResults = (noResultsData) => {
        noResultsData = noResultsData || this.noResultsData;
        return <EmptySearchResult  noResultsData={noResultsData}/>
    };

    render() {
        if(this.getTagId()){
            return <VideoCollections
                    onRef={(elem) => this.videoCollections = elem}
                    listHeaderComponent={this._headerComponent()}
                    beforeRefresh={this.beforeRefresh}
                    getFetchUrl={this.getFetchUrl}
                    navigation={this.props.navigation}
                    noResultsData={this.noResultsData}
                    getNoResultsCell={this.renderNoResults}
                   />
        } else {
            return <View style={{flex: 1 , backgroundColor: Colors.black}} />
        }
    }
}

export default VideoTags;
