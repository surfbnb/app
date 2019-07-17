import React from 'react';
import {View,Text,Image,Dimensions,TouchableWithoutFeedback} from 'react-native';
import reduxGetter from "../../../services/ReduxGetters";

import inlineStyles from './styles';
import playIcon from '../../../assets/play_icon.png'
import {connect} from "react-redux";


const mapStateToProps = (state, ownProps) => {
  return{
    coverImageUrl : reduxGetter.getImage( ownProps.coverImageId, state ),
  }
}

class CoverImage extends React.Component {
  constructor(props){
    super(props);
  }

  getImage = () => {
    return this.props.coverImageUrl;
  }

  showVideo = () => {
    this.props.navigation.push("VideoPlayer" , { videoId : this.props.videoId} );
  }
  render(){
    return(
      <TouchableWithoutFeedback onPress={this.showVideo}>
        <View>
          <Image style={[{width : "100%" , height: Dimensions.get('screen').height * 0.65 }, this.props.style ]}  source={{uri: this.getImage()}} />
          <Image style={inlineStyles.playIconSkipFont} source={playIcon}></Image>
        </View>
      </TouchableWithoutFeedback>
    )
  }

}

export default connect(mapStateToProps)(CoverImage) ;