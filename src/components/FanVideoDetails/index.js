import React, { Component } from 'react';
import {Image, ImageBackground, Text, View} from 'react-native';

import styles from './styles';
import VideoDescription from './VideoDescription';

import playIcon from "../../assets/play_icon.png";
import twitterDisconnectIcon from '../../assets/drawer-twitter-icon.png';
import TouchableButton from "../../theme/components/TouchableButton";
import Theme from "../../theme/styles";
import LinearGradient from "react-native-linear-gradient";

class FanVideoDetails extends Component {
  constructor(props) {
    super(props);
    this.initialValue = '';
  }
  render() {
    let imageUrl = 'https://www-images.christianitytoday.com/images/61372.jpg'
    return (
      <View style={styles.container}>
        <View>
          <View style={[styles.videoDescriptionItem, {paddingVertical: 20}]}>
            <ImageBackground style={styles.posterImageSkipFont} source={{ uri: imageUrl }}>
              <Image style={styles.playIconSkipFont} source={playIcon} />
            </ImageBackground>
            <VideoDescription
              horizontal={this.props.horizontal}
              initialValue={this.initialValue}
              onChangeTextDelegate={this.onChangeTextDelegate}
              placeholderText="Bio"
              submitEvent={this.submitEvent}
            />
          </View>
          <View style={styles.videoDescriptionItem}>
            <Image style={{ height: 24, width: 25.3 }} source={twitterDisconnectIcon} />
            <Text style={{color: '#4a90e2', flex: 1, marginLeft: 10}} numberOfLines={1} ellipsizeMode={'tail'}>
              Congrats & thanks to @pet3rpan_ & team @meta_cartel for a truly fantastic demo day today, high quality, well attended - great kickoff for #BerlinBlockchainWeek
            </Text>
          </View>
        </View>
        <LinearGradient
          colors={['#ff7499', '#ff5566']}
          locations={[0, 1]}
          style={{ borderRadius: 3, marginHorizontal: 20}}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <TouchableButton
            TouchableStyles={[{ minWidth: '100%', borderColor: 'none', borderWidth: 0}]}
            TextStyles={[Theme.Button.btnPinkText]}
            text="SHARE"
            onPress={{}}
          />
        </LinearGradient>
      </View>
    );
  }
}

export default FanVideoDetails;
