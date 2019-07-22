import React from 'react';
import {View,Text,Image,Dimensions,TouchableWithoutFeedback,TouchableOpacity} from 'react-native';
import {connect} from "react-redux";

import reduxGetter from "../../../services/ReduxGetters";
import inlineStyles from './styles';
import playIcon from '../../../assets/play_icon.png'
import Colors from '../../../theme/styles/Colors'
import { withNavigation } from 'react-navigation';
import FastImage from 'react-native-fast-image';
import appConfig from "../../../constants/AppConfig";

const mapStateToProps = (state, ownProps) => {
  return{
    coverImageId : reduxGetter.getUserCoverImageId(ownProps.userId, state) , 
    videoId : reduxGetter.getUserCoverVideoId( ownProps.userId, state ),
    coverImageUrl :  reduxGetter.getImage(  reduxGetter.getUserCoverImageId(ownProps.userId, state), state ),
    videoInProcessing : reduxGetter.getVideoProcessingStatus(state),
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
    return this.props.coverImageUrl ? (
      <View style={[this.props.wrapperStyle]} >
        <TouchableWithoutFeedback onPress={this.showVideo}>
          <View>
            <FastImage
              style={[{ backgroundColor: Colors.gainsboro },{width : "100%" , height: Dimensions.get('screen').height * this.height }, this.props.style]}
              source={{uri: this.getImage(),priority:FastImage.priority.high}}
            />
            <Image style={inlineStyles.playIconSkipFont} source={playIcon}></Image>
            {this.isProfile &&(
              <TouchableOpacity
                disabled={this.props.videoInProcessing}
                onPress={this.uploadVideo}

                  style={inlineStyles.updateVideo}>
                <Text style={{color:Colors.white}}>{this.props.videoInProcessing?'Video uploading...':'Update Video'}</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    ) : (<View/>)
  }

}

export default connect(mapStateToProps)( withNavigation( CoverImage ) );