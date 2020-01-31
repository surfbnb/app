import React from 'react';
import {View, Image, Text} from 'react-native';
import {withNavigation} from 'react-navigation';

import channelNotAvailable from '../../../assets/channel-not-available.png';
import inlineStyles from './styles';

const deletedChannelInfo = () => (<View style={inlineStyles.container}>
                    <Image style={inlineStyles.imgSizeSkipFont} source={channelNotAvailable} />
                    <Text style={inlineStyles.desc}>The channel you were looking for does not exist!</Text>
                </View>);

export default withNavigation(deletedChannelInfo);