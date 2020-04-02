import React, { Component } from 'react';
import {View, StatusBar, Text, SafeAreaView, ScrollView, Image, TouchableOpacity} from 'react-native';
import Colors from "../../theme/styles/Colors";
import inlineStyles from "../CreateCommunities/styles";
import uploadPic from "../../assets/new-community-upload-icon.png";
import Theme from "../../theme/styles";
import LinearGradient from "react-native-linear-gradient";
import ReduxGetters from '../../services/ReduxGetters';
import PepoApi from '../../services/PepoApi';
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
    const channelName = ReduxGetters.getChannelName(navigation.getParam('channelId')) || AppConfig.channelConstants.newChannelHeaderText
    return {
      title: channelName,
      headerTitleStyle: { fontFamily: 'AvenirNext-Medium'},
      headerStyle: {
        backgroundColor: Colors.white,
        borderBottomWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3
      },
      headerBackTitle: null
    };
  };

  constructor(props) {
    super(props);

    this.channelId        = this.props.navigation.getParam('channelId');
    this.type             = this.props.navigation.getParam('type');

    this.placeholderText  = "Write Here...";

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

    this.state= {
      ...this.getInitData(),
      ...this.defaults,
      current_formField : 0,
      inputTagValue : null
    }

  }

  isCreate = () => {
    return ( this.type == AppConfig.channelConstants.types.create && !this.channelId );
  }

  isEdit = () => {
    return ( this.type == AppConfig.channelConstants.types.edit && this.channelId );
  }

  getCreateApiEndPoint = () => {
    return  DataContract.communities.getCommunityEditApi();
  }

  getEditApiEndPoint = () => {
    return DataContract.communities.getCommunityCreateApi();
  }

  getSubmitEndPoint = () => {
    if(this.isCreate()){
      return this.getCreateApiEndPoint();
    }else if(this.isEdit()){
      return this.getEditApiEndPoint();
    }
  }

  getInitData = () => {
    if(this.isCreate()){
     return {
        name        :  "",
        tagline     :  "",
        about_info  :  "",
        tags        :  []
      }
    }else if(this.isEdit()){
      return {
        name        :  ReduxGetters.getChannelName(this.channelId),
        tagline     :  ReduxGetters.getChannelTagLine(this.channelId),
        about_info  :  ReduxGetters.getChannelDescription(this.channelId),
        tags        :  ReduxGetters.getChannelTags(this.channelId)
      }
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
      this.__setState({
        tagline_error: ostErrors.getUIErrorMessage('tagline_req_communities')  //TODO : Shraddha  get ui error msgs from UX
      });
      isValid = false;
    }
    if (!this.state.about_info) {
      this.__setState({
        about_info_error: ostErrors.getUIErrorMessage('about_info_req')  //TODO : Shraddha  get ui error msgs from UX
      });
      isValid = false;
    }

    if(!this.state.tags.length){
      this.__setState({
        tags_error: ostErrors.getUIErrorMessage('tags_req')  //TODO : Shraddha  get ui error msgs from UX
      });
    }
    return isValid;
  }

  getParams() {
    if(this.isCreate()){
      return {
        channel_id: this.channelId,
        channel_name: this.state.name,
        channel_tagline: this.state.tagline,
        channel_description : this.state.about_info,
        channel_tags: this.state.tags,
        ...this.getImagePostData()
      };
    }else if(this.isEdit()){
      return {
        channel_id: this.channelId,
        channel_name: this.state.name,
        channel_tagline: this.state.tagline,
        channel_description : this.state.about_info,
        channel_tags: this.state.tags,
        ...this.getImagePostData()
      };
    }
  }

  getImagePostData = () => {
    //TODO deepesh sir
  }

  onSubmit() {
    this.clearErrors();
    if (this.validateProfileInput()) {
      this.__setState({ btnText: btnPostText });
      return new PepoApi(this.getSubmitEndPoint())
        .post(this.getParams())
        .then((res) => {
          if (res && res.success) {
            this.onSubmitSuccess(res)
          } else {
            this.onSubmitError(res);
          }
        })
        .catch((error) => {
          this.onSubmitError(res);
        })
        .finally(()=> {
          this.onSubmitComplete();
        })
        ;
    }
  }

  onSubmitSuccess = (res) => {
    //TODO confrim with UX what to do here.
  }

  onSubmitError = (res) => {
    const errorMsg = ostErrors.getErrorMessage(res);
    this.__setState({ server_errors: res, general_error: errorMsg });
  }

  onSubmitComplete = () => {
    this.__setState({ btnText: btnPreText });
  }

  onNameChange = ( name ) =>{
    this.__setState({
      name,
      name_error: null
    });
  }

  onTaglineChange = ( tagline ) =>{
    this.__setState({
      tagline,
      tagline_error: null
    });
  }

  onAboutInfoChange = ( about_info ) =>{
    this.__setState({
      about_info,
      about_info_error: null
    });
  }

  onTagsChange = ( tagInputvalue ) =>{
    if(this.state.tags.length >= MAX_NO_OF_TAGS ) return;

    const newState = {
      tags_error: null
    };

    if(!this.isValidChar(tagInputvalue)){
      newState["inputTagValue"] = "";
      this.addTagToTagArray( tagInputvalue ,  newState);
      return;
    }

    newState["inputTagValue"] = tagInputvalue;

    this.__setState(newState);
  }

  isValidChar(val) {
    const spaceRegex = /\s/g;
    return val && !spaceRegex.test(val);
  }

  addTagToTagArray = ( tag  , newState={}) => {
    let tagsArray = this.state.tags || [];
    tagsArray.push(tag);
    newState["tags"] = tagsArray;
    this.__setState(newState);
  }

  onSubmitEditing(val) {
    let inputTag = val.nativeEvent.text;
    if(this.state.tags.length <  MAX_NO_OF_TAGS){
      this.addTagToTagArray(inputTag);
    } else{
      this.__setState({
        tags_error:ostErrors.getUIErrorMessage('max_no_tags_communities')  //TODO : Shraddha  get ui error msgs from UX
      });
    }
    this.__setState({
      inputTagValue :''
    })
  }

  getformattedDisplayTag = (index) =>{
    if(this.state.tags[index][0] !== "#"){
      return "#"+this.state.tags[index];
    }else{
      return this.state.tags[index];
    }
  }

  onRemoveTagPress = ( index , val ) =>{
    this.state.tags.splice(index , 1);
    this.__setState({tags: this.state.tags});
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

  addAnImage = () => {
    return <View style={inlineStyles.imageBg}>
      <View style={inlineStyles.imageWrapper}>
        <Image source={uploadPic} style={inlineStyles.uploadPic} />
        <Text style={inlineStyles.imgBgTxt}>Add a community image</Text>
        <Text style={[inlineStyles.imgBgTxt, inlineStyles.imgBgSmallTxt]}>(Min. 1500 x 642 px with max. image size of 3 MB)</Text>
      </View>
    </View>
  };

  communityName = () => {
    return <React.Fragment>
      <View style={inlineStyles.communityLabelWrapper}>
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
          <Text style={inlineStyles.dynamicCount}>{this.state.name.length}/{NAME_MAXLENGTH}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  communityTagline = () => {
    return <React.Fragment>
      <View style={inlineStyles.communityLabelWrapper}>
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
          <Text style={inlineStyles.dynamicCount}>{this.state.tagline.length}/{TAGLINE_MAXLENGTH}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  aboutTheCommunity = () => {
    return <React.Fragment>
      <View style={inlineStyles.communityLabelWrapper}>
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
          <Text style={[inlineStyles.dynamicCount,inlineStyles.textAreaDynamicCountHeight]}>{this.state.about_info.length}/{ABOUT_INFO_MAXLENGTH}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  communityTags = () => {
    return <React.Fragment>
      <View style={inlineStyles.communityLabelWrapper}>
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
          <Text style={inlineStyles.dynamicCount}>{this.state.tags.length}/{MAX_NO_OF_TAGS}</Text>
        </View>
      </View>
    </React.Fragment>
  };


  getTagThumbnailMarkup = (index,displayTag) =>{
    return(
      <View style={inlineStyles.tagThumbnail} >
        <Text key={index} style={inlineStyles.displayTag}>{displayTag} </Text>
        <TouchableOpacity
          onPress={()=> {this.onRemoveTagPress(index)}}
          style={inlineStyles.crosIconBackground}
        ><Text style={inlineStyles.crossIcon}>&#10005;</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if(!this.isCreate() && !this.isEdit()) return <View style={{flexGrow: 1, backgroundColor: Colors.white, flex:1 }} />;
    return (
        <SafeAreaView forceInset={{ top: 'never' }} style={inlineStyles.safeAreaView}>
          <ScrollView
            contentContainerStyle=
              {inlineStyles.scrollViewContainerStyle}
            showsVerticalScrollIndicator={false}>
            {this.addAnImage()}
            <View style={inlineStyles.formWrapper}>
              {this.communityName()}
              {this.communityTagline()}
              {this.aboutTheCommunity()}
              <View style={inlineStyles.tagsWrapper}>
                {this.showAddedTags()}
              </View>

              {this.communityTags()}
              <LinearGradient
                colors={['#ff7499', '#ff5566']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={inlineStyles.linearGradient}
              >
                <TouchableOpacity
                  onPress={MultipleClickHandler(() => this.onSubmit())}
                  style={[Theme.Button.btn, { borderWidth: 0 }]}
                >
                  <Text
                    style={[
                      Theme.Button.btnPinkText,
                      inlineStyles.gradientBtnText
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

