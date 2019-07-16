import React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';

import inlineStyles from './styles';
import Theme from "../../theme/styles";
import EditIcon from "../../assets/edit_icon.png";

export default class ProfileEdit extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <View style={{}}>

        <Text style={{}}>Name</Text>
        <TextInput
          editable={true}
          textContentType="none"
          style={[Theme.TextInput.textInputStyle, {marginBottom: 10}]}
          placeholder="Name"
          returnKeyType="next"
          returnKeyLabel="next"
          placeholderTextColor="#ababab"
          />

        <Text style={{}}>Username</Text>
        <TextInput
          editable={true}
          textContentType="none"
          style={[Theme.TextInput.textInputStyle, {marginBottom: 10}]}
          placeholder="User Name"
          returnKeyType="next"
          returnKeyLabel="next"
          placeholderTextColor="#ababab"
        />

        <Text style={{}}>Bio</Text>
        <TextInput
          editable={true}
          multiline={true}
          textContentType="none"
          style={[Theme.TextInput.textInputStyle, {marginBottom: 10, height: 75, paddingVertical: 15}]}
          placeholder="Link"
          returnKeyType="next"
          returnKeyLabel="next"
          maxLength = {100}
          placeholderTextColor="#ababab"
        />

        <Text style={{}}>Link</Text>
        <TextInput
          editable={true}
          textContentType="none"
          style={[Theme.TextInput.textInputStyle, {marginBottom: 10}]}
          placeholder="Link"
          returnKeyType="next"
          returnKeyLabel="next"
          placeholderTextColor="#ababab"
        />

        <TouchableOpacity
          style={[Theme.Button.btn, Theme.Button.btnPink]}
        >
          <Text style={[Theme.Button.btnPinkText, {textAlign: 'center'}]}>Save Profile</Text>
        </TouchableOpacity>

      </View>
    )
  }

}