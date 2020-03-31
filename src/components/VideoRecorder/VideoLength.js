import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  View,
  Easing,
  Animated,
  Text,
  ScrollView
} from 'react-native';

import styles from './styles';

export default class VideoLength extends PureComponent{
  constructor(props){
    super(props);
  }

  onPress30 = () =>{
    this.showSecondsOnScreen(30);



  }

  onPress90 = () =>{
    this.showSecondsOnScreen(90);

  }

  showSecondsOnScreen = ( seconds ) =>{
    //TODO:Shraddha
    // store second in local var
    // if this is true then send true
    this.props.setVideoLength(seconds,true);
  }

  render(){
    return (
      <View
        style={styles.videolengthContainer}>
        <TouchableOpacity
          style={styles.videolengthItems}
          onLayout={(event)=>{
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log("x,",x,":width,",width);
          }}
          onPress={this.onPress30} // TODO: Shraddha implement multiclickhandler
        >
          <Text>30 sec </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.videolengthItems}
          onLayout={(event)=>{
            var {x, y, width, height} = event.nativeEvent.layout;
            console.log(" 90 secs x,",x,":width,",width);
          }}
          onPress={this.onPress90} // TODO: Shraddha implement multiclickhandler
        >
          <Text>90 sec </Text>
        </TouchableOpacity>
      </View>
    )

  }
}