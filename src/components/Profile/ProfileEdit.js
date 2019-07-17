import React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';

import inlineStyles from './styles';
import Theme from "../../theme/styles";
import EditIcon from "../../assets/edit_icon.png";
import FormInput from "../../theme/components/FormInput";

export default class ProfileEdit extends React.Component{
  constructor(props){
    super(props)
  }

  render(){
    return(
      <View style={{}}>

        <Text style={{}}>Name</Text>

        <FormInput
          editable={true}
          fieldName="name"
          textContentType="none"
          style={[
            Theme.TextInput.textInputStyle
          ]}
          placeholder="Name"
          returnKeyType="next"
          returnKeyLabel="Next"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
        />

        <Text style={{}}>Username</Text>
        <FormInput
          editable={true}
          fieldName="username"
          textContentType="none"
          style={[
            Theme.TextInput.textInputStyle
          ]}
          placeholder="User Name"
          returnKeyType="next"
          returnKeyLabel="Next"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
        />

        <Text style={{}}>Bio</Text>
        <FormInput
          editable={true}
          multiline={true}
          fieldName="bio"
          textContentType="none"
          style={[
            Theme.TextInput.textInputStyle, , {marginBottom: 10, height: 75, paddingVertical: 15}
          ]}
          placeholder="Bio"
          returnKeyType="next"
          returnKeyLabel="Next"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
          maxLength = {100}
        />

        <Text style={{}}>Link</Text>
        <FormInput
          editable={true}
          fieldName="link"
          textContentType="none"
          style={[
            Theme.TextInput.textInputStyle
          ]}
          placeholder="Link"
          returnKeyType="next"
          returnKeyLabel="Next"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
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