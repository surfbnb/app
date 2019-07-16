import React from 'react';
import {View,Text,TouchableOpacity,Image} from 'react-native';

import inlineStyles from './styles';
import videoIcon from '../../assets/video_icon.png'

export default class EmptyCoverImage extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <View style={inlineStyles.emptyCoverWrapper}>
        <Text style={inlineStyles.updateText}>Update your fans!</Text>
        <TouchableOpacity style={inlineStyles.videoIconBtn}>
          <Image style={{width:19,height:15}} source={videoIcon}></Image>
        </TouchableOpacity>
        <Text style={inlineStyles.creatVideoText} >Create a Video</Text>
      </View>
    )
  }

}