import React, { PureComponent } from 'react';
import {View , TouchableOpacity , Image} from "react-native";
import { withNavigation } from 'react-navigation';
import VideoWrapper from "./VideoWrapper";
import PepoApi from "../../services/PepoApi";
import reduxGetter from "../../services/ReduxGetters";
import TransactionPepoButton from "./TransactionPepoButton";
import tx_icon from '../../assets/tx_icon.png';
import pricer from "../../services/Pricer";
import currentUserModel from "../../models/CurrentUser";

import BottomStatus from "./BottomStatus";
import inlineStyles from './styles';

class HomeFeedRow extends PureComponent {

    constructor(props){
        super(props);
        this.state = {
            refreshed   : false,
            totalBt     : this.totalBt ,
            supporters  : this.supporters,
            isSupported : this.isVideoSupported
        }
    }

    get userId(){
        return reduxGetter.getHomeFeedUserId( this.props.feedId ); 
    }

    get videoId(){
       return reduxGetter.getHomeFeedVideoId( this.props.feedId );
    }

    get userName(){
        return reduxGetter.getUserName( this.userId );
    }

    get name(){
        return reduxGetter.getName( this.userId );
    }

    get bio(){
        return reduxGetter.getBio( this.userId );
    }

    get supporters(){
        return Number( reduxGetter.getVideoSupporters( this.videoId ) ) || 0;
    }

    get totalBt(){
        return pricer.getFromDecimal( reduxGetter.getVideoBt( this.videoId ) );
    }

    get isVideoSupported(){
        return reduxGetter.isVideoSupported( this.videoId )
    }

    onLocalUpdate = ( totalBt  ) => {
        let newState = { totalBt : totalBt }; 
        if( !this.isVideoSupported ){ 
            newState["supporters"] = this.supporters + 1 ;  
            newState["isSupported"] =  true ; 
        }
        this.setState(newState); 
    }
    
    onLocalReset = ( totalBt ) => {
        let newState = { totalBt : totalBt }; 
        if( !this.isVideoSupported ){
            newState["supporters"] = this.supporters;  
            newState["isSupported"] = false ;  
        }
        this.setState(newState); 
    }

    refetchFeed = () => {
        this.state.refreshed = true; // change silently 
        new PepoApi(`/feed/${this.props.feedId}`) 
        .get()
        .then((res) => {
          this.onRefresh();
        })
        .catch((error) => {});
    }

    onRefresh(){
        let newState = { totalBt : this.totalBt , suporters : this.supporters , refreshed: false }; 
        this.setState( newState );
    }
    
    navigateToTransactionScreen = (e) => {
        console.log("reduxGetter.getUser(this.userId)" , reduxGetter.getUser(this.userId) , this.userId);
        if(  currentUserModel.checkActiveUser() && currentUserModel.isUserActivated() ){
            this.props.navigation.push('TransactionScreen' ,
                { toUserId: this.userId, 
                videoId :reduxGetter.getHomeFeedVideoId(this.props.feedId),
                requestAcknowledgeDelegate: this.refetchFeed
                }
            );
        }  
    };

    render() {
        console.log("render HomeFeedRow");
        return  (
            <View>
               
               { this.props.doRender && 
                    <VideoWrapper   videoId={this.videoId}
                                    isActive={ this.props.isActive }/>   }        

                <View style={inlineStyles.bottomContainer} pointerEvents={'box-none'}>
                    
                    <View style={inlineStyles.touchablesBtns}>
                        <TransactionPepoButton  totalBt={this.state.totalBt} 
                                                isSupported={this.state.isSupported}
                                                onLocalUpdate={this.onLocalUpdate}
                                                onLocalReset={this.onLocalReset}
                                                isSupported={this.state.isSupported}
                                                feedId={this.props.feedId}
                                                userId={reduxGetter.getHomeFeedUserId(this.props.feedId)}
                                                videoId={reduxGetter.getHomeFeedVideoId(this.props.feedId)}  />            
                        <TouchableOpacity pointerEvents={'auto'} onPress={this.navigateToTransactionScreen} 
                                        style={inlineStyles.txElem}>
                            <Image style={{ height: 57, width: 57 }} source={tx_icon} />
                        </TouchableOpacity>
                    </View>

                    <BottomStatus   userName={this.userName}
                                    name={this.name}
                                    bio={this.bio}  
                                    feedId={this.props.feedId}
                                    supporters={this.state.supporters}
                                    isSupported={this.state.isSupported}
                                    totalBt={this.state.totalBt}
                                />          
                </View>              
            </View>                                  
        )
    }

}


export default withNavigation( HomeFeedRow ); 