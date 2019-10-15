import React, { Component } from 'react';
import { Text, View } from 'react-native';

import inlineStyles from './style';

export default class EmptySearchResult extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let displayMsg = this.props.message;
    return(
      <View style={inlineStyles.emptyWrapper}>
        <Text style={inlineStyles.msgStyle}>{displayMsg}</Text>
      </View>
    )
  }
}
