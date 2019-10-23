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
        isEmpty: true
    };
    this.textInputRef = null;
  }

  onChangeText = (text) => {
    clearTimeout(this.searchThrottle);
    this.searchThrottle = setTimeout(()=>{
        this.updateIsEmptyState( text );
        this.props.setSearchParams(text);
    }, 300);
  };

  clearSearch = () => {
    this.props.setSearchParams("");
    this.setInputText("");
  };

    setTextInputRef = (textInputRef) => {
        this.textInputRef = textInputRef;
        if ( this.props.initialSearchText ) {
            this.setInputText( this.props.initialSearchText );
        }
    };

    updateIsEmptyState = ( searchText ) => {
        const isEmpty = !searchText || searchText.length < 1;
        if( this.state.isEmpty !== isEmpty) {
            this.setState({
                isEmpty: isEmpty
            });
        }
    };

    setInputText = ( text ) => {
        if ( this.textInputRef ) {
            this.textInputRef.setNativeProps({
                "text": text
            });
        }
        this.updateIsEmptyState( text );
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
          ref={this.setTextInputRef}
          textContentType="none"
          //value={this.state.value}
          style={[Theme.TextInput.textInputStyle, styles.textInputUi]}
          placeholder="Search people or tags"
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholderTextColor="rgba(42, 41, 59, 0.4)"
          onChangeText={this.onChangeText}
          autocomplete="off"
        />
        {!this.state.isEmpty ? (
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
