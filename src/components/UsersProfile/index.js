import React, { Component } from 'react';
import { View , Text , ActivityIndicator } from 'react-native';
import reduxGetter from "../../services/ReduxGetters";
import PepoApi from "../../services/PepoApi";
import BackArrow from "../CommonComponents/BackArrow";
import { Toast } from 'native-base';
import VideoWrapper from "../Home/VideoWrapper";
import UserInfo from '../../components/CommonComponents/UserInfo';
import { ostErrors } from "../../services/OstErrors";

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

    isLoading(){
        if( this.state.loading ){
            return ( <ActivityIndicator /> );
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: "#fff"}}>
              {this.isLoading()}
              {/* <VideoWrapper  isActive={ true }
                             isPaused={ true }
                             style={{}}
                             videoId={this.videoId}
                             videoUrl={ this.videoUrl }
                             videoImgUrl={this.videoImgUrl} /> */}
              <UserInfo userId={this.userId}/>
             </View>
        )
    }
}