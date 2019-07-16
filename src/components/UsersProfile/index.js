import React, { Component } from 'react';
import { View , TouchableOpacity , ActivityIndicator , Image , ScrollView} from 'react-native';
import reduxGetter from "../../services/ReduxGetters";
import PepoApi from "../../services/PepoApi";
import BackArrow from "../CommonComponents/BackArrow";
import { Toast } from 'native-base';
import VideoWrapper from "../Home/VideoWrapper";
import UserInfo from '../../components/CommonComponents/UserInfo';
import { ostErrors } from "../../services/OstErrors";
import currentUserModel from "../../models/CurrentUser";

import tx_icon from '../../assets/tx_icon.png';

 //TODO Shraddha move to common place,  Get in touch with Thahir. Not a good practices
import iconStyle from "../Home/styles";import inlineStyles from './styles';

export default class UsersProfile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
          title: reduxGetter.getName( navigation.getParam('userId') ) ,
          headerBackImage: (<BackArrow/>)
        };
    };

    constructor(props){
        super(props);
        this.userId =  this.props.navigation.getParam('userId');
        this.videoId = reduxGetter.getUserCoverVideoId( this.userId );
        this.state = {
            loading : true
        }
    }

    componentDidMount(){
        this.fetchUser();
    }

    isLoading(){
        if( this.state.loading ){
            return ( <ActivityIndicator /> );
        }
    }

    fetchUser = () => {
        new PepoApi(`/users/${this.userId}/profile`)
        .get()
        .then((res) =>{
            this.setState({ loading : false });
            if( !res ||  !res.success ){
                Toast.show({
                    text: ostErrors.getErrorMessage( res ),
                    buttonText: 'OK'
                });
            }
        })
        .catch((error) =>{
            this.setState({ loading : false });
            Toast.show({
                text: ostErrors.getErrorMessage( error ),
                buttonText: 'OK'
            });
        })
    }

    navigateToTransactionScreen = () => {
        if(  currentUserModel.checkActiveUser() && currentUserModel.isUserActivated() ){
            this.props.navigation.push('TransactionScreen' ,
                {   toUserId: this.userId,
                    requestAcknowledgeDelegate: this.fetchUser
                }
            );
        }
    }

    render() {
        return (
            <ScrollView style={{ backgroundColor: "#fff"}}>
              {this.isLoading()}
              <VideoWrapper  isActive={ true }
                             isPaused={ true }
                             ignoreScroll={true}
                             style={inlineStyles.videoWrapperSkipFont}
                             videoId={this.videoId}
                             videoUrl={ this.videoUrl }
                             videoImgUrl={this.videoImgUrl} />
              <UserInfo userId={this.userId}/>
             <View style={[iconStyle.touchablesBtns , {position:"absolute" , top: "50%"}]}>
                    <TouchableOpacity pointerEvents={'auto'} onPress={this.navigateToTransactionScreen}
                                    style={iconStyle.txElem}>
                        <Image style={{ height: 57, width: 57 }} source={tx_icon} />
                    </TouchableOpacity>
              </View>
             </ScrollView>
        )
    }
}