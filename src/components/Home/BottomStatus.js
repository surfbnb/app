import React, { PureComponent } from 'react';
import {View, Text, Image, TouchableOpacity} from "react-native";
import TouchableButton from '../../theme/components/TouchableButton';
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

  render(){
    return (
      <View style={{ width: '100%', position: 'absolute', bottom: 50}}>
        {/*<TouchableButton*/}
          {/*TouchableStyles={[Theme.Button.btnPink]}*/}
          {/*TextStyles={[Theme.Button.btnPinkText]}*/}
          {/*text="Transaction"*/}
          {/*onPress={(e) => {this.exTransaction(e)}}*/}
        {/*></TouchableButton>*/}
        <View style={{alignSelf: 'flex-end', marginBottom: 15, marginRight: 20}}>
          <TouchableOpacity onPress={(e) => {this.exTransaction(e)}}>
            <Image
              style={{height: 53, width: 53}}
              source={pepo_tx_icon}
            />
          </TouchableOpacity>
          <Text style={{fontSize: 18, color: 'white', alignSelf: 'center', marginTop: 5}}>304</Text>
        </View>
        <TouchableOpacity onPress={(e) => {this.exTransaction(e)}}>
          <Image
            style={{marginBottom: 20, alignSelf: 'flex-end', marginRight: 20, height: 57, width: 57}}
            source={tx_icon}
          />
        </TouchableOpacity>
        <View style={{backgroundColor: 'rgba(0, 0, 0, 0.6)', maxHeight: 150, flex: 1, flexDirection: 'row', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 15}}>
          <View style={{flex: 0.7, flexWrap: 'wrap'}}>
            <Text style={{color: 'white', marginBottom: 5}}>@Annik</Text>
            <Text style={{color: 'white', paddingRight: 20, fontSize: 13}}>Based out of NYC, I Play bass with ‘City of suns’.  You can find us at Atla - East Village every Saturday. #Podcaster #Artist #Musician</Text>
          </View>
          <View style={{flex: 0.3}}>
            <Text style={{color: 'white', marginBottom: 5}}>$ 5K Raised</Text>
            <Text style={{color: 'white'}}>$ 2K Supporters</Text>
          </View>
        </View>
      </View>
    )
  }

}

export default withNavigation(BottomStatus);