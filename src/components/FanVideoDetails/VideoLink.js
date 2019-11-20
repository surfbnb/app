import React, { Component } from 'react';
import { TextInput, TouchableOpacity, Image } from 'react-native';

import styles from './styles';
import CloseIcon from '../../assets/modal-cross-icon.png';

class VideoLink extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.initialValue
    };
  }

  onChangeValue = (value) => {
    this.setState(
      {
        value
      },
      () => {
        this.props.onChangeLink(value);
      }
    );
  };

  onLinkCrossIconClick = () =>{
    this.onChangeValue("");
  }

  render() {
    return (
      <React.Fragment>
        <TextInput
          style={styles.linkText}
          numberOfLines={1}
          ellipsizeMode={'tail'}
          returnKeyType="done"
          returnKeyLabel="Done"
          placeholder="Add a link to your video"
          onChangeText={this.onChangeValue}
          value={this.state.value}
          autoCapitalize={'none'}
        />
        {this.state.value ? <TouchableOpacity onPress={this.onLinkCrossIconClick}>
          <Image source={CloseIcon} style={{height:13,width:13}}></Image>
        </TouchableOpacity> : <React.Fragment/>}
      </React.Fragment>
    );
  }
}

export default VideoLink;
