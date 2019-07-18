import React from 'react';
import {View,Text,Image,Dimensions,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import {connect} from "react-redux";

import reduxGetter from "../../../services/ReduxGetters";
import inlineStyles from './styles';
import playIcon from '../../../assets/play_icon.png'
import Colors from '../../../theme/styles/Colors'
import { withNavigation } from 'react-navigation';

const mapStateToProps = (state, ownProps) => {
  return{
    coverImageId : reduxGetter.getUserCoverImageId(ownProps.userId, state) , 
    videoId : reduxGetter.getUserCoverVideoId( ownProps.userId, state ),
    coverImageUrl :  reduxGetter.getImage(  reduxGetter.getUserCoverImageId(ownProps.userId, state), state ),
  }
}

class CoverImage extends React.Component {
  constructor(props){
    super(props);
    this.height = this.props.height || 0.65;
    this.isProfile = this.props.isProfile || false;
  }

  getImage = () => {
    return this.props.coverImageUrl;
  }

  showVideo = () => {
    this.props.navigation.push("VideoPlayer" , { videoId : this.props.videoId} );
  }


  uploadVideo = () => {
    this.props.uploadVideo  && this.props.uploadVideo();
  }

  render(){
    console.log("in render",this.props.coverImageUrl,this.props.coverImageId,this.props.videoId)
    return this.props.coverImageUrl ? (
      <View style={[this.props.wrapperStyle]} >
        <TouchableWithoutFeedback onPress={this.showVideo}>
          <View>
            <Image style={[{width : "100%" , height: Dimensions.get('screen').height * this.height }, this.props.style ]}  source={{uri: this.getImage()}} />
            <Image style={inlineStyles.playIconSkipFont} source={playIcon}></Image>
            {this.isProfile &&(
              <TouchableOpacity onPress={this.uploadVideo}
                  style={{position:'absolute',bottom:0,backgroundColor:'rgba(0,0,0,0.75)',width:'100%',height:50,justifyContent:'center',alignItems:'center'}}>
                <Text style={{color:Colors.white}}>Update Video</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    ) : (<View/>)
  }

}

export default connect(mapStateToProps)( withNavigation( CoverImage ) );