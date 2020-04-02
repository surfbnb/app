import React, { Component } from 'react';
import { Text, View , Image} from 'react-native';

import inlineStyles from './style';
import notFound from '../../../assets/not-found.png';

export default class EmptySearchResult extends Component{
  constructor(props){
    super(props)
  }

  render(){
    let noResultData = this.props.noResultsData;
    return(
      <View style={inlineStyles.emptyWrapper}>
         <Image style={inlineStyles.imgSizeSkipFont} source={notFound} />
         <Text style={inlineStyles.msgStyle}>{noResultData.noResultsMsg}</Text>
         {this.props.children}
      </View>
    )
  }
}
