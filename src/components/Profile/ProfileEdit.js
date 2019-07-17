import React from 'react';
import {View, Text, Image, TextInput, TouchableOpacity} from 'react-native';
import { connect } from 'react-redux';


import inlineStyles from './styles';
import Theme from "../../theme/styles";
import profileEditIcon from "../../assets/profile-edit-icon.png";
import default_user_icon from '../../assets/default_user_icon.png';
import FormInput from "../../theme/components/FormInput";
import reduxGetter from "../../services/ReduxGetters";

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName( ownProps.userId ,state ),
    name: reduxGetter.getName( ownProps.userId , state ),
    bio: reduxGetter.getBio( ownProps.userId , state ),
    link : reduxGetter.getLink( reduxGetter.getUserLink(ownProps.userId , state ) ,  state ),
  }
}

class ProfileEdit extends React.PureComponent{
  
  constructor(props){
    super(props)
  }

  render(){
    return(
      <View style={{}}>

        <View style={inlineStyles.editProfileContainer}>
          <Image style={{width: 75,height: 75}} source={default_user_icon}></Image>
          <View style={inlineStyles.editProfileIconPos}>
            <Image style={{width: 13,height: 13}} source={profileEditIcon}></Image>
          </View>
        </View>

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

export default connect(mapStateToProps)(ProfileEdit) ;