import {Dimensions, Image, Text, TouchableWithoutFeedback, View} from "react-native";
import React from 'react';
import FastImage from 'react-native-fast-image';
import Colors from "../../../theme/styles/Colors";
import LinearGradient from "react-native-linear-gradient";
import pepoWhiteIcon from "../../../assets/pepo-white-icon.png";
import inlineStyles from "./style";
import reduxGetters from "../../../services/ReduxGetters";
import AppConfig from "../../../constants/AppConfig";
import multipleClickHandler from '../../../services/MultipleClickHandler'
import Pricer from "../../../services/Pricer";
import deepGet from 'lodash/get';




let getVideoBtAmount = (videoId) => {
    return Pricer.displayAmountWithKFomatter( Pricer.getFromDecimal( reduxGetters.getVideoBt(videoId) ) ) ;
}

export default (props) => {
    const videoId =  deepGet(props, 'payload.video_id'),
        userName = reduxGetters.getUserName(deepGet(props, 'payload.user_id')),
        imageUrl = reduxGetters.getVideoImgUrl(videoId,null, AppConfig.userVideos.userScreenCoverImageWidth),
        videoDesc =reduxGetters.getVideoDescription(reduxGetters.getVideoDescriptionId(videoId));


    return <TouchableWithoutFeedback onPress={multipleClickHandler(() => { props.onVideoClick(videoId, props.index );} )}
    >
        <View>

            <FastImage style={{
                width: (Dimensions.get('window').width - 6) / 2,
                aspectRatio:9/16,
                margin: 1,
                backgroundColor: imageUrl ? Colors.white : Colors.gainsboro
            }}
                       source={{
                           uri: imageUrl,
                           priority: FastImage.priority.high
                       }}/>
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.3)', 'transparent', 'transparent']}
                locations={[0, 0.5, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', top: 0, left: 0, alignItems: 'flex-end'}}
            >
                <View style={inlineStyles.videoStatsContainer}>
                    <Image style={{height: 14, width: 14}} source={pepoWhiteIcon} />
                    <Text style={inlineStyles.videoStatsTxt}>{getVideoBtAmount(videoId)}</Text>
                </View>
            </LinearGradient>
            <LinearGradient
                colors={['transparent', 'rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.3)']}
                locations={[0,0.4, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={{width: (Dimensions.get('window').width - 6) / 2, margin: 1, position: 'absolute', bottom: 0, left: 0}}
            >
                <View style={inlineStyles.videoInfoContainer}>
                 <Text style={inlineStyles.videoUserNameStyle}>@{userName}</Text>
                <Text style={inlineStyles.videoDescStyle}>{videoDesc}</Text>
                </View>
            </LinearGradient>

        </View>
    </TouchableWithoutFeedback>
}