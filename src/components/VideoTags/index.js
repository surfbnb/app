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
import BackArrow from '../CommonComponents/BackArrow';
import DataContract from "../../constants/DataContract";

const getPageTitle = (tagId, hashTag) => {
  let pageTitle = "";
  if ( typeof tagId !== 'undefined' || hashTag ) {
    hashTag = hashTag || reduxGetter.getHashTag(tagId);
    if ( hashTag && hashTag.text) {
      pageTitle = `#${hashTag.text}`;
    }
  }
  return pageTitle;
}


class VideoTags extends PureComponent {
    static navigationOptions = (options) => {
        const tagId = options.navigation.getParam('tagId');
        const hashTag = options.navigation.getParam('hashTag') || null;
        const pageTitle = getPageTitle(tagId, hashTag);

        return {
            headerBackTitle: null,
            title: pageTitle,
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
            },
          headerBackImage: <BackArrow />
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
            this.getTagData();
        });
    }

    getTagData = () =>{
        const tagId = this.getTagId();
        new PepoApi(`/tags/${tagId}`)
            .get()
            .then((res)=>{
                let result_type = deepGet(res, DataContract.common.resultType),
                hashTag = deepGet(res, `data.${result_type}` );
                if (res && res.success){
                    this.props.navigation.setParams({ hashTag: hashTag });
                }
            })
    }

    componentWillUnmount() {
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

    getExtraParams = () => {
        return {
            showBalanceFlier: true
        };
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
                    extraParams={this.getExtraParams()}
                   />
        } else {
            return <View style={{flex: 1 , backgroundColor: Colors.black}} />
        }
    }
}

export default VideoTags;
