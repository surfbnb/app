import React, { PureComponent } from 'react';
import {View, Image , Text} from "react-native";
import PinnedVideo from '../../../assets/pinned-video-icon.png';
import inlineStyle from "./styles";

export default (props) => {
    if( props.isPinned ){
      return   <View style={inlineStyle.wrapper}>
        <Image source={PinnedVideo} style={inlineStyle.imageSkipFont} />
        <Text style={inlineStyle.text}>Pinned Video</Text>
      </View>
    }
    return  null;
};

