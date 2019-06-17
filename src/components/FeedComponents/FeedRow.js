import React, { Component } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import styles from './styles';
import PepoIcon from '../../assets/user_friends.png';

class FeedRow extends Component {
  constructor(props) {
    super(props);
    this.gif = {
      downsized: {
        frames: null,
        height: '480',
        media_id: 'KHJw9NRFDMom487qyo',
        mp4: null,
        mp4_size: null,
        rendition_type: 'downsized',
        size: '1400997',
        url:
          'https://media0.giphy.com/media/KHJw9NRFDMom487qyo/giphy-downsized.gif?cid=3f796fa35d07874c35565a722e845130&rid=giphy-downsized.gif',
        webp: null,
        webp_size: null,
        width: '270'
      }
    };
  }

  render() {

    return (
      <View style={styles.container}>
        <View style={styles.cellWrapper}>
          <View style={{ flexDirection: 'row', marginBottom: 10 }}>
            <View style={{ width: '15%', height: 50 }}>
              <Image
                source={{ uri: 'https://image.flaticon.com/icons/png/512/17/17004.png' }}
                style={{
                  // backgroundColor: '#ef5566',
                  padding: 5,
                  borderRadius: 30,
                  height: '100%',
                  width: '100%'
                }}
              />
            </View>
            <View style={{ width: '70%', height: 50, marginLeft: 10, marginTop: 5 }}>
              <Text style={{ fontSize: 18 }}>
                <Text style={{ fontWeight: 'bold' }}> Sender </Text>
                <Text>gave </Text>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}> Receiver:</Text>
              </Text>
              <Text style={{ marginLeft: 5 }}>just now</Text>
            </View>
            <View
              style={{
                width: '15%',
                borderRadius: 20,
                height: 40,
                backgroundColor: '#EEEEEE',
                marginTop: 7,
                justifyContent: 'center'
              }}
            >
              <Text style={{ fontSize: 18, textAlign: 'center' }}>P1</Text>
            </View>
          </View>
          <View>
            <Image
              source={{ uri: this.gif.downsized.url }}
              style={{
                //height: parseInt(this.gif.downsized.height) * ratioFullScreen,
                width: '100%', //parseInt(this.gif.downsized.width) * ratioFullScreen
                aspectRatio: parseInt(this.gif.downsized.width) / parseInt(this.gif.downsized.height)
              }}
            />
          </View>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18 }}>"Message sent with gif"</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default FeedRow;
