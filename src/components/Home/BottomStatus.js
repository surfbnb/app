import React, { PureComponent } from 'react';
import {View, Text, Image, TouchableOpacity, Alert, Animated} from "react-native";

import inlineStyles from "./styles";
import {withNavigation} from "react-navigation";
import tx_icon from "../../assets/tx_icon.png";
import pepo_tx_icon from "../../assets/pepo-tx-icon.png";


class BottomStatus extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      paused : false
    }
  }

  componentWillMount() {
    this.yPos = new Animated.Value(0);
    this.opacit = new Animated.Value(0);
  }
  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.yPos, {
        toValue: -100,
        duration: 500,
        useNativeDriver: true
      }),
      Animated.timing(this.opacit,{
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      })
    ]).start();
  }

  exTransaction(e){
    this.setState({paused: true},  ()=>{
      this.props.navigation.push('TransactionScreen');
    });
  }

  showAlert(e){
    Alert.alert(
      'YET TO BE IMFLEMENTED!'
    )
  }

  render(){
    let bubbleAnimatedStyle = {
      transform: [{ translateY: this.yPos }],
      opacity: this.opacit,
    };
    return (
      <View style={ inlineStyles.bottomContainer } pointerEvents="none" >

        <View style={ inlineStyles.touchablesBtns }>
          <TouchableOpacity style={inlineStyles.pepoElemBtn}>
            <Image
              style={{height: 19, width: 19}}
              source={pepo_tx_icon}
            />
            {/*<Animated.View*/}
            {/*style={[inlineStyles.clappedBubble]}*/}
            {/*pointerEvents="auto"*/}
            {/*>*/}
            {/*<Text style={inlineStyles.btnText}>BTN</Text>*/}
            {/*</Animated.View>*/}
          </TouchableOpacity>
          <Text style={inlineStyles.pepoTxCount}>304</Text>

          <TouchableOpacity onPress={(e) => {this.exTransaction(e)}}
                            style={inlineStyles.txElem}
          >
            <Image
              style={{ height: 57, width: 57}}
              source={tx_icon}
            />
          </TouchableOpacity>
        </View>

        <View style={inlineStyles.bottomBg}>
          <View style={{flex: 0.7, flexWrap: 'wrap'}}>
            <Text style={[{marginBottom: 5}, inlineStyles.bottomBgTxt]}>@Annik</Text>
            <Text style={[{paddingRight: 20, fontSize: 13}, inlineStyles.bottomBgTxt]}>Based out of NYC, I Play bass with ‘City of suns’.  You can find us at Atla - East Village every Saturday. #Podcaster #Artist #Musician</Text>
          </View>
          <View style={{flex: 0.3}}>
            <Text style={[{marginBottom: 5}, inlineStyles.bottomBgTxt]}>$ 5K Raised</Text>
            <Text style={inlineStyles.bottomBgTxt}>$ 2K Supporters</Text>
          </View>
        </View>

      </View>
    )
  }

}

export default withNavigation(BottomStatus);