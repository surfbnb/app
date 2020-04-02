import React, { Component } from 'react';
import {View, StatusBar, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity} from 'react-native';
import Colors from "../../theme/styles/Colors";
import inlineStyles from "../CreateCommunities/styles";
import uploadPic from "../../assets/new-community-upload-icon.png";
import Theme from "../../theme/styles";
import CustomTextInput from "../CommonComponents/TagsInput/CustomTextInput";
import LinearGradient from "react-native-linear-gradient";
import ReduxGetters from '../../services/ReduxGetters';
import { fetchUser } from '../../helpers/helpers';
import PepoApi from '../../services/PepoApi';
import CurrentUser from '../../models/CurrentUser';
import { ostErrors } from '../../services/OstErrors';
import DataContract from '../../constants/DataContract'
import FormInput from '../../theme/components/FormInput';
import MultipleClickHandler from '../../services/MultipleClickHandler';
import AppConfig from '../../constants/AppConfig';

const btnPreText = 'Submit',
      btnPostText = 'Submiting...',
      MAX_NO_OF_TAGS = 5,
      NAME_MAXLENGTH = 25,
      TAGLINE_MAXLENGTH = 45,
      ABOUT_INFO_MAXLENGTH = 400;


class CreateCommunitiesScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'New Community',
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 1
        },
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);
    this.placeholderText  = "Write Here...";
    this.channelId        = this.props.navigation.getParam('replyDetailId');
    this.isNew            = this.props.navigation.getParam('isNew');
    if(!this.isNew || this.channelId){
      //determine form submit route here
      this.apiEndpoint = DataContract.communities.getCommunityEditApi();
    }else{
      this.apiEndpoint = DataContract.communities.getCommunityCreateApi();
    }

    this.tabIndex = {
      name: 1,
      tagline: 2,
      about_info : 3,
      tags:4
    };

    this.defaults = {
      name_error: null,
      tagline_error: null,
      about_info_error : null,
      tags_error : null,
      server_errors: {},
      general_error: null,
      btnText: btnPreText
    };


    this.state={
      name        : this.channelId ? ReduxGetters.getCurrentUserProfile() : "",
      tagline     : this.channelId ? ReduxGetters.getCurrentUserProfile() : "",
      about_info  : this.channelId ? ReduxGetters.getCurrentUserProfile() : "",
      tags        : this.channelId ? ReduxGetters.getCurrentUserProfile() : [],
      current_formField : 0,
      name_character_count:0,
      tagline_character_count:0,
      about_info_character_count:0,
      tags_count :0,
      inputTagValue : null,
      ...this.defaults
    }


  }

  __setState = (state) =>{
    if(!state) return;
    this.setState(state);
  }

  clearErrors = () => {
    this.__setState(this.defaults);
  }

  validateProfileInput = () =>{
    let isValid = true;
    if (!this.state.name) {
      this.__setState({
        name_error: ostErrors.getUIErrorMessage('name_req_communities')    //TODO : Shraddha  get ui error msgs from UX
      });
      isValid = false;
    }
    if (!this.state.tagline) {
      this.setState({
        tagline_error: ostErrors.getUIErrorMessage('tagline_req_communities')  //TODO : Shraddha  get ui error msgs from UX
      });
      isValid = false;
    }

    if (!this.state.about_info) {
      this.setState({
        about_info_error: ostErrors.getUIErrorMessage('about_info_req')  //TODO : Shraddha  get ui error msgs from UX
      });
      isValid = false;
    }

    if(!this.state.tags.length){
      this.setState({
        tags_error: ostErrors.getUIErrorMessage('tags_req')  //TODO : Shraddha  get ui error msgs from UX
      });
    }
    return isValid;
  }

  getParams() {
    return {
      name: this.state.name,
      tagline: this.state.tagline,
      about_info : this.state.about_info,
      tags: this.state.tags,
    };
  }

  onServerError(res) {
    const errorMsg = ostErrors.getErrorMessage(res);
    this.__setState({ server_errors: res, general_error: errorMsg });
  }

  addTagToTagArray = ( tag ) => {
    let tagsArray = this.state.tags || [];
    tagsArray.push(tag);
    let tagsLength = this.state.tags.length;
    this.__setState({
      tags:tagsArray,
      tags_count:tagsLength
    });
  }
  onSubmitEditing(val) {
    let inputTag = val.nativeEvent.text;
    if(this.state.tags.length <  MAX_NO_OF_TAGS){
      this.addTagToTagArray(inputTag);
    } else{
      this.__setState({
        tags_error:ostErrors.getUIErrorMessage('max_no_tags_communities')               //TODO : Shraddha  get ui error msgs from UX
      });
    }
    this.__setState({
      inputTagValue :''
    })



  }

  onSubmit() {
    this.clearErrors();
    if (this.validateProfileInput()) {
      this.__setState({ btnText: btnPostText });
      return new PepoApi(this.apiEndpoint)
        .post(this.getParams())
        .then((res) => {
          this.__setState({ btnText: btnPreText });
          if (res && res.success) {
            //What to do here ?
          } else {
            this.onServerError(res);
          }
        })
        .catch((error) => {
          this.__setState({ btnText: btnPreText });
        });
    }
  }

  addAnImage = () => {
    return <View style={inlineStyles.imageBg}>
      <View style={{display: 'flex', alignItems: 'center'}}>
        <Image source={uploadPic} style={inlineStyles.uploadPic} />
        <Text style={inlineStyles.imgBgTxt}>Add a community image</Text>
        <Text style={[inlineStyles.imgBgTxt, inlineStyles.imgBgSmallTxt]}>(Min. 1500 x 642 px with max. image size of 3 MB)</Text>
      </View>
    </View>
  };

  onNameChange = ( name ) =>{
    this.__setState({
      name,
      name_error: null,
      name_character_count:name.length
    });
  }

  onTaglineChange = ( tagline ) =>{
    this.__setState({
      tagline,
      tagline_error: null,
      tagline_character_count: tagline.length
    });
  }

  onAboutInfoChange = ( about_info ) =>{
    this.__setState({
      about_info,
      about_info_error: null,
      about_info_character_count: about_info.length
    });
  }

  onTagsChange = ( tagInputvalue ) =>{
    this.__setState({
      tags_error: null,
      inputTagValue : tagInputvalue
    });
  }

  communityName = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>Community Name</Text>
        <Text style={inlineStyles.labelHint}>Give your community an identity! (Max 20 chars)</Text>
      </View>
      <View style={inlineStyles.inputWrapper}>
        <View style={inlineStyles.formInputWrapper}>
          <FormInput
            maxLength={NAME_MAXLENGTH}
            editable={true}
            onChangeText={this.onNameChange}
            fieldName="name"
            textContentType="none"
            style={[inlineStyles.customTextInputBox]}
            placeholder="Write here..."
            returnKeyType="next"
            returnKeyLabel="Next"
            placeholderTextColor="'rgba(42, 41, 59, 0.4);'"
            blurOnSubmit={false}
            isFocus={this.state.current_formField == this.tabIndex.name}
            onFocus={() => {
              this.__setState({
                current_formField: this.tabIndex.name
              });
            }}
            onSubmitEditing={() => {
              this.onSubmitEditing(this.tabIndex.name);
            }}
            value={this.state.name}
            errorMsg={this.state.name_error}
            serverErrors={this.state.server_errors}
          />
        </View>

        <View>
          <Text style={inlineStyles.dynamicCount}>{this.state.name_character_count}/{NAME_MAXLENGTH}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  communityTagline = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>Community Tagline</Text>
        <Text style={inlineStyles.labelHint}>Something which shows what your community is about (Max 45 chars)</Text>
      </View>
      <View style={inlineStyles.inputWrapper}>
        <View style={inlineStyles.formInputWrapper}>
          <FormInput
            maxLength={TAGLINE_MAXLENGTH}
            editable={true}
            onChangeText={this.onTaglineChange}
            fieldName="tagline"
            textContentType="none"
            style={[inlineStyles.customTextInputBox]}
            placeholder="Write here..."
            returnKeyType="next"
            returnKeyLabel="Next"
            placeholderTextColor="'rgba(42, 41, 59, 0.4);'"
            blurOnSubmit={false}
            isFocus={this.state.current_formField == this.tabIndex.tagline}
            onFocus={() => {
              this.__setState({
                current_formField: this.tabIndex.tagline
              });
            }}
            onSubmitEditing={() => {
              this.onSubmitEditing(this.tabIndex.tagline);
            }}
            value={this.state.tagline}
            errorMsg={this.state.tagline_error}
            serverErrors={this.state.server_errors}
          />
        </View>
        <View>
          <Text style={inlineStyles.dynamicCount}>{this.state.tagline_character_count}/{TAGLINE_MAXLENGTH}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  aboutTheCommunity = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>About the community</Text>
        <Text style={inlineStyles.labelHint}>Something which best describes it (Max. 400 chars)</Text>
      </View>
      <View style={inlineStyles.inputWrapper}>
        <View style={inlineStyles.formInputWrapper}>
          <FormInput
            maxLength={ABOUT_INFO_MAXLENGTH}
            editable={true}
            multiline={true}
            onChangeText={this.onAboutInfoChange}
            fieldName="about_info"
            textContentType="none"
            style={[inlineStyles.customTextInputBox,inlineStyles.customTextAreaBox]}
            placeholder="Write the description here..."
            returnKeyType="next"
            returnKeyLabel="Next"
            placeholderTextColor="'rgba(42, 41, 59, 0.4);'"
            blurOnSubmit={false}
            isFocus={this.state.current_formField == this.tabIndex.about_info}
            onFocus={() => {
              this.__setState({
                current_formField: this.tabIndex.about_info
              });
            }}
            onSubmitEditing={() => {
              this.onSubmitEditing(this.tabIndex.about_info);
            }}
            value={this.state.about_info}
            errorMsg={this.state.about_info_error}
            serverErrors={this.state.server_errors}
          />
        </View>
        <View>
          <Text style={[inlineStyles.dynamicCount,inlineStyles.textAreaDynamicCountHeight]}>{this.state.about_info_character_count}/{ABOUT_INFO_MAXLENGTH}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  communityTags = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>Community Tags</Text>
        <Text style={inlineStyles.labelHint}>These tags place videos in your community. Learn More</Text>
      </View>
      <View style={inlineStyles.inputWrapper}>
        <Text style={inlineStyles.hastagPrefilled}>#</Text>
        <View style={inlineStyles.formInputWrapper}>
          <FormInput
            ref={input=>{this.tagsInputRef = input}}
            editable={true}
            fieldName="tags"
            onChangeText={this.onTagsChange}
            textContentType="none"
            style={[inlineStyles.customTextInputBox]}
            placeholder="Enter Tag..."
            returnKeyType="next"
            returnKeyLabel="Next"
            placeholderTextColor="'rgba(42, 41, 59, 0.4);'"
            blurOnSubmit={false}
            isFocus={this.state.current_formField == this.tabIndex.tags}
            onFocus={() => {
              this.__setState({
                current_formField: this.tabIndex.tags
              });
            }}
            onSubmitEditing={(val) => {
              this.onSubmitEditing(val,this.tabIndex.tags);
            }}
            value={this.state.inputTagValue}
            errorMsg={this.state.tags_error}
            serverErrors={this.state.server_errors}
          />
        </View>
        <View>
          <Text style={inlineStyles.dynamicCount}>{this.state.tags_count}/{MAX_NO_OF_TAGS}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  getformattedDisplayTag = (index) =>{
    if(this.state.tags[index][0] !== "#"){
      return "#"+this.state.tags[index];
    }else{
      return this.state.tags[index];
    }
  }

  onRemoveTagPress = ( val ) =>{

  }

  getTagThumbnailMarkup = (index,displayTag) =>{
    return(
      <View style={inlineStyles.tagThumbnail} >
        <Text key={index}>{displayTag} </Text>
        <TouchableOpacity
          onPress={this.onRemoveTagPress}
        ><Text>X</Text>
        </TouchableOpacity>
      </View>
    )
  }

  showAddedTags = () => {
    if (!this.state.tags.length) return;
    let tagsDisplay = [],
        displayTag ='';
    for(let i = 0 ; i < this.state.tags.length ; i++  ){
      displayTag = this.getformattedDisplayTag(i);
      tagsDisplay.push(this.getTagThumbnailMarkup(i,displayTag))
    }
    return tagsDisplay;
  }

  render() {
    return (
        <SafeAreaView forceInset={{ top: 'never' }} style={{flexGrow: 1, backgroundColor: Colors.white }}>
          <ScrollView
            contentContainerStyle=
              {{flexGrow: 1, backgroundColor: Colors.white}}
            showsVerticalScrollIndicator={false}>
            {this.addAnImage()}
            <View style={{paddingHorizontal: 15, paddingBottom: 30}}>
              {this.communityName()}
              {this.communityTagline()}
              {this.aboutTheCommunity()}
              <View style={{flexDirection:'row',flex:1}}>
                {this.showAddedTags()}
              </View>

              {this.communityTags()}
              <LinearGradient
                colors={['#ff7499', '#ff5566']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ marginTop: 25, borderRadius: 3 }}
              >
                <TouchableOpacity
                  onPress={MultipleClickHandler(() => this.onSubmit())}
                  style={[Theme.Button.btn, { borderWidth: 0 }]}
                >
                  <Text
                    style={[
                      Theme.Button.btnPinkText,
                      { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                    ]}
                  >{this.state.btnText}
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </ScrollView>
        </SafeAreaView>
    );
  }
}

export default CreateCommunitiesScreen;

