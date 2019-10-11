import React, { Component } from 'react';
import { View, TouchableOpacity, Image, TextInput } from 'react-native';

import Theme from '../../theme/styles';
import searchNs from '../../assets/user-search-icon.png';
import styles from './styles';
import CrossIcon from '../../assets/cross_icon.png';

class SearchListHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };
  }

  onChangeText = (text) => {
    this.props.setSearchParams(text);
    this.setState({
      value: text || ''
    });
  };

  clearSearch = () => {
    this.props.setSearchParams("");
    this.setState({
      value: ''
    });
  };

  render() {
    return (
      <View style={{ position: 'relative', justifyContent: 'center', paddingHorizontal: 10 }}>
        <TouchableOpacity
          style={[
            styles.iconsPos,
            {
              justifyContent: 'center'
            }
          ]}
          activeOpacity={0.7}
        >
          <Image source={searchNs} style={[styles.searchIconSkipFont]} />
        </TouchableOpacity>
        <TextInput
          editable={true}
          ref="search_query"
          textContentType="none"
          value={this.state.value}
          style={[Theme.TextInput.textInputStyle, styles.textInputUi]}
          placeholder="Search People / Usernames"
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholderTextColor="rgba(42, 41, 59, 0.4)"
          onChangeText={this.onChangeText}
          autocomplete="off"
        />
        {this.state.value ? (
          <TouchableOpacity
            style={[styles.iconsPos, { right: 0, justifyContent: 'center' }]}
            onPress={this.clearSearch}
          >
            <Image source={CrossIcon} style={[styles.crossIconSkipFont]} />
          </TouchableOpacity>
        ) : (
          <React.Fragment />
        )}
      </View>
    );
  }
}

export default SearchListHeader;
