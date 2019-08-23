import React,{Component} from 'react';
import {Text,View,TouchableOpacity,Image,TextInput} from 'react-native';

import Theme from "../../theme/styles";

import searchNs from '../../assets/user-search-icon.png';
import styles from "./styles";
import CrossIcon from "../../assets/cross_icon.png";

class SearchListHeader extends Component{
  constructor(props){
    super(props);
  }

  onChangeText = (text) =>{
        if(text.length >= 3){
          this.props.setSearchParams(text);
        }
  }
  render(){
    return(

      <View style={{position: 'relative'}}>
        <TouchableOpacity style={styles.iconsPos} activeOpacity={0.7}>
          <Image source={searchNs} style={[styles.searchIconSkipFont]} />
        </TouchableOpacity>
        <TextInput
          editable={true}
          ref="search_query"
          textContentType="none"
          style={[Theme.TextInput.textInputStyle, styles.textInputUi]}
          placeholder="Search People / Usernames"
          returnKeyType="next"
          returnKeyLabel="next"
          placeholderTextColor="rgba(42, 41, 59, 0.4)"
          onChangeText = {this.onChangeText}
        />
        <TouchableOpacity style={[styles.iconsPos, {right: 0}]}>
          <Image source={CrossIcon} style={[styles.crossIconSkipFont]} />
        </TouchableOpacity>
      </View>
    )
  }

}

export default SearchListHeader;