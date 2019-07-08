import React, { PureComponent } from 'react';
import {View, Text, Image, TouchableOpacity, Alert} from "react-native";
// import TouchableButton from '../../theme/components/TouchableButton';
import Theme from '../../theme/styles';

import inlineStyles from "./styles";
import {withNavigation} from "react-navigation";
import styles from "../CustomTab/styles";
import tx_icon from "../../assets/tx_icon.png";
import pepo_tx_icon from "../../assets/pepo_tx_icon.png";


class BottomStatus extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      paused : false
    }
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
    return (
      <View style={ inlineStyles.bottomContainer }>
        {/*<TouchableButton*/}
          {/*TouchableStyles={[Theme.Button.btnPink]}*/}
          {/*TextStyles={[Theme.Button.btnPinkText]}*/}
          {/*text="Transaction"*/}
          {/*onPress={(e) => {this.exTransaction(e)}}*/}
        {/*></TouchableButton>*/}
        <View style={inlineStyles.pepoElem}>
          <TouchableOpacity onPress={(e) => {this.showAlert(e)}}>
            <Image
              style={{height: 53, width: 53}}
              source={pepo_tx_icon}
            />
          </TouchableOpacity>
          <Text style={inlineStyles.pepoTxCount}>304</Text>
        </View>
        <View style={inlineStyles.txElem}>
          <TouchableOpacity onPress={(e) => {this.exTransaction(e)}}>
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