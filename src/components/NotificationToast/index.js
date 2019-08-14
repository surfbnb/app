import React from 'react';
import { View, Text } from 'react-native';

export default () => (<View style={{
    width: 200,
    height: 20,
    backgroundColor: 'red',
    position: 'absolute',
    top: 30,
    zIndex: 999
}}><Text>ABC</Text></View>);
