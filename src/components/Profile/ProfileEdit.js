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
    super(props);

    this.state = {
      current_formField: 0,
      name: null,
      username: null,
      bio: null,
      link: null,
    };

    this.tabIndex = {
      name: 1,
      username: 2,
      bio: 3,
      link: 4
    };

  }

  onSubmitEditing(currentIndex) {
    this.setState({
      current_formField: currentIndex + 1
    });
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
          onSubmitEditing={() => {
            this.onSubmitEditing(this.tabIndex.name);
          }}
          isFocus={this.state.current_formField == this.tabIndex.name}
          onFocus={() => {
            this.state.current_formField = this.tabIndex.name;
          }}
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
          onSubmitEditing={() => {
            this.onSubmitEditing(this.tabIndex.username);
          }}
          isFocus={this.state.current_formField == this.tabIndex.username}
          onFocus={() => {
            this.state.current_formField = this.tabIndex.username;
          }}
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
          onSubmitEditing={() => {
            this.onSubmitEditing(this.tabIndex.bio);
          }}
          isFocus={this.state.current_formField == this.tabIndex.bio}
          onFocus={() => {
            this.state.current_formField = this.tabIndex.bio;
          }}
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
          onSubmitEditing={() => {
            this.onSubmitEditing(this.tabIndex.link);
          }}
          isFocus={this.state.current_formField == this.tabIndex.link}
          onFocus={() => {
            this.state.current_formField = this.tabIndex.link;
          }}
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