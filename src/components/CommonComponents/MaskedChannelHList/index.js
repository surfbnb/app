import React, { PureComponent } from 'react';
import {View} from 'react-native';

import MaskedView from '@react-native-community/masked-view';
import ChannelNamesFlatlist from '../ChannelNamesFlatlist';
import LinearGradient from "react-native-linear-gradient";

export default () => (
    //@Thahir move inline style to Style sheet 
    <View style={{marginRight: '20%', marginTop: 20, justifyContent: 'center'}}>
      <MaskedView
        style={{ flex: 1, flexDirection: 'row', height: '100%' }}
        maskElement={
          <View
            style={{
              // Transparent background because mask is based off alpha channel.
              backgroundColor: 'transparent',
              flex: 1
            }}
          >
            <LinearGradient
              colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0.05)', 'rgba(255, 255, 255, 0)']} // Color does not matter for masking - only alpha matters
              locations={[0.71, 0.91, 1]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={{flex: 1}}/>
          </View>
        }
      >
        {/* Shows behind the mask, you can put anything here, such as an image */}
        <ChannelNamesFlatlist />
      </MaskedView>
   </View> 
)
