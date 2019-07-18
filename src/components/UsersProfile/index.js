import React, { Component } from 'react';
import { View , TouchableOpacity , ActivityIndicator , Image , ScrollView , Dimensions} from 'react-native';
import reduxGetter from "../../services/ReduxGetters";
import PepoApi from "../../services/PepoApi";
import BackArrow from "../CommonComponents/BackArrow";
import { Toast } from 'native-base';

import UserInfo from '../../components/CommonComponents/UserInfo';
import { ostErrors } from "../../services/OstErrors";
import currentUserModel from "../../models/CurrentUser";
import playIcon from '../../assets/play_icon.png'

import tx_icon from '../../assets/tx_icon.png';
import inlineStyles from './styles'

 //TODO Shraddha move to common place,  Get in touch with Thahir. Not a good practices
import iconStyle from "../Home/styles";
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import CoverImage from "../CommonComponents/CoverImage";


export default class UsersProfile extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
          title: reduxGetter.getName( navigation.getParam('userId') ) ,
          headerBackTitle: null,
          headerBackImage: (<BackArrow/>)
        };
    };

    constructor(props){
        super(props);
        this.userId =  this.props.navigation.getParam('userId');
        this.videoId = reduxGetter.getUserCoverVideoId( this.userId );
        this.coverImageId = reduxGetter.getUserCoverImageId(this.userId);
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
            <ScrollView style={{ backgroundColor: "#fff",flex:1}}>
              {this.isLoading()}
              <CoverImage userId={this.userId} />
              <UserInfo userId={this.userId}/>
             <View style={[iconStyle.touchablesBtns , {position:"absolute" , top: "75%"}]}>
                    <TouchableOpacity pointerEvents={'auto'} onPress={this.navigateToTransactionScreen}
                                    style={iconStyle.txElem}>
                        <Image style={{ height: 57, width: 57 }} source={tx_icon} />
                    </TouchableOpacity>
              </View>
             </ScrollView>
        )
    }
}