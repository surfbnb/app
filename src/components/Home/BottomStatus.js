import React, { PureComponent } from 'react';
import {View, Text} from "react-native";
import Theme from '../../theme/styles';

import inlineStyles from "./styles";


class BottomStatus extends PureComponent {

  constructor(props){
    super(props);

  }

  render(){
    return (
      <View style={{ width: '100%', position: 'absolute', bottom: 50}}>
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

export default BottomStatus;