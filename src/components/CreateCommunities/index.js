import React, { Component } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
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
import CameraPermissionsApi from '../../services/CameraPermissionsApi';
import AllowAccessModal from '../Profile/AllowAccessModal';
import GalleryIcon from '../../assets/gallery_icon.png';

import RNFS from 'react-native-fs';
import ImageSize from 'react-native-image-size';
import UploadToS3 from '../../services/UploadToS3';
import InlineError from '../../theme/components/FormInput/inlineError';
import { fetchChannel } from '../../helpers/helpers';
import CrossIconTags from '../../assets/cross_icon_tags.png'
import deepGet from "lodash/get";

import Toast from '../../theme/components/NotificationToast';

const btnPreText = AppConfig.channelConstants.btnPreText,
      btnPostText = AppConfig.channelConstants.btnPostText,
      MAX_NO_OF_TAGS = AppConfig.channelConstants.MAX_NO_OF_TAGS,
      NAME_MAXLENGTH = AppConfig.channelConstants.NAME_MAXLENGTH,
      TAGLINE_MAXLENGTH = AppConfig.channelConstants.TAGLINE_MAXLENGTH,
      ABOUT_INFO_MAXLENGTH = AppConfig.channelConstants.ABOUT_INFO_MAXLENGTH;


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
      image_error: null,
      server_errors: {},
      general_error: null,
      btnText: btnPreText
    };

    this.state= {
      ...this.getInitData(),
      ...this.defaults,
      inputTagValue : null,
      communityBannerUri : null,
      current_formField : 0,
      showGalleryAccessModal: false,
      isSubmitting : false
    }

    this.localBannerImageUri = '';
    this.imageInfo = {};

  }

  componentWillUnmount() {
    this.deleteLocalBannerImage(this.localBannerImageUri);
  }

  async deleteLocalBannerImage(imageUri) {
    if(imageUri !== '') {
      await RNFS.exists(imageUri)
        .then(async (result) => {
            if(result){
              return RNFS.unlink(imageUri)
                .catch((err) => {});
            }
          })
          .catch((err) => {});
    }
  }

  isCreate = () => {
    return ( this.type == AppConfig.channelConstants.types.create && !this.channelId );
  }

  isEdit = () => {
    return ( this.type == AppConfig.channelConstants.types.edit && this.channelId );
  }

  getCreateApiEndPoint = () => {
    return DataContract.communities.getCommunityCreateApi();
  }

  getEditApiEndPoint = () => {
    return  DataContract.communities.getCommunityEditApi(this.channelId);
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
        tags        :  this.getChannelTags(),
        coverImage  :  ReduxGetters.getChannelBackgroundImage(this.channelId)
      }
    }
  }

  getChannelTags = () => {
    let tags = ReduxGetters.getChannelTagIds(this.channelId)
        tagNames = [] , currTag = null 
     ; 
     return tags.map((item)=> {
        currTag = ReduxGetters.getHashTag(item) || {} ; 
        return  currTag.text;
     })
  }

  __setState = (state) =>{
    if(!state) return;
    this.setState(state);
  }

  clearErrors = () => {
    this.__setState(this.defaults);
  }

  validateCommunityForm = () =>{
    let isValid = true;

    if(this.isCreate()){
      if(!this.state.communityBannerUri ){
        this.__setState({
          image_error: ostErrors.getUIErrorMessage('cover_img_req_communities')
        });
        isValid = false;
      }
    }
    
    if (!this.state.name) {
      this.__setState({
        name_error: ostErrors.getUIErrorMessage('name_req_communities')
      });
      isValid = false;
    }

    if (!this.state.tagline) {
      this.__setState({
        tagline_error: ostErrors.getUIErrorMessage('tagline_req_communities')
      });
      isValid = false;
    }

    if (!this.state.about_info) {
      this.__setState({
        about_info_error: ostErrors.getUIErrorMessage('about_info_req')
      });
      isValid = false;
    }

    if(!this.state.tags.length){
      this.__setState({
        tags_error: ostErrors.getUIErrorMessage('tags_req')
      });
    }

    return isValid;
  }

  getParams() {
    if(this.isCreate()){
      return {
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
     return this.imageInfo
  }

  onSubmit() {
    this.clearErrors();
    this.__setState({
      isSubmitting:true
    })
    if (this.validateCommunityForm()) {
      this.beforeSubmit();
      if(this.state.communityBannerUri) {
        this.uploadToS3(this.state.communityBannerUri)
          .then(()=>{this.updateDataToServer()})
          .catch(async ()=> {
            this.onSubmitComplete();
           });
      }else{
        this.updateDataToServer();
      }
    }
  }
  
  beforeSubmit = () =>{
    this.__setState({ btnText: btnPostText });
  }

  uploadToS3( imagePath ) {
    let uploadToS3 = new UploadToS3([imagePath], "channelImages");
    return uploadToS3
      .perform()
      .then((s3ProfileImage) => {
        if( s3ProfileImage.length == 1){
          return this.onUploadToS3Success( s3ProfileImage );
        }else{
          this.onUploadToS3Error();
        }
      }).catch((error) => {
        this.onUploadToS3Error(error);
        return Promise.reject(error);
      });
  }

  onUploadToS3Success = (s3ProfileImage) => {
    return ImageSize.getSize(this.state.communityBannerUri).then(async (sizeInfo) => {
      const imgWidth = sizeInfo.width;
      const imgHeight = sizeInfo.height;
      let   imageInfo = await RNFS.stat(this.state.communityBannerUri);
      const imageSize = imageInfo.size;
      this.imageInfo  = {
        'cover_image_width' : imgWidth,
        'cover_image_height' : imgHeight,
        'cover_image_file_size' : imageSize,
        'cover_image_url' : s3ProfileImage[0]
      }
    });
  }

  onUploadToS3Error = (error) => {
    const errorMsg = ostErrors.getErrorMessage(error) || ostErrors.getUIErrorMessage('cover_img_upload_communities');
    this.__setState({image_error:errorMsg });
  }

  updateDataToServer = () => {
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
    });
  }

  onSubmitSuccess = (res) => {
    this.__setState({
      isSubmitting:false
    });
    if(this.isCreate()){
      Toast.show({
        text: AppConfig.channelConstants.createSuccessMsg,
        icon: 'success'
      });
      const channelId = deepGet(res , "data.channel.id");
      this.props.navigation.replace("ChannelsScreen", {channelId:channelId} );
    }else if(this.isEdit()){
      Toast.show({
        text: AppConfig.channelConstants.editSuccessMsg,
        icon: 'success'
      });
      fetchChannel(this.channelId,  null, null, ()=> {
        this.props.navigation.goBack();
      });
    }
  }

  onSubmitError = (res) => {
    const errorMsg = ostErrors.getErrorMessage(res);
    this.__setState({ server_errors: res, general_error: errorMsg, isSubmitting:false });
  }

  onSubmitComplete = () => {
    this.__setState({ btnText: btnPreText, isSubmitting:false });
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

    newState["inputTagValue"] = tagInputvalue;
    if(!this.isValidChar(tagInputvalue)){
      this.addTagToTagArray( tagInputvalue ,  newState);
    } else {
      this.__setState(newState);
    }
  }

  isValidChar(val) {
    const spaceRegex = /\s/g;
    return val && !spaceRegex.test(val);
  }

  addTagToTagArray = ( tag=""  , newState={}) => {
    tag = tag.trim();
    // Check if the tag has any character other than just space.
    if(tag.length > 0 ) {
      let tagsArray = this.state.tags || [];
      // Check if the tag is already present.
      const index = tagsArray.findIndex(item => tag.toLowerCase() === item.toLowerCase());
      if(index < 0) {
        newState["inputTagValue"] = "";
        tagsArray.push(tag.trim());
        newState["tags"] = tagsArray;
      } else {
        newState["inputTagValue"] = tag;
      }
    } 
    this.__setState(newState);
  }

  onSubmitEditing(currentIndex,val) {
    if(currentIndex == this.tabIndex.tags){
      let inputTag = val.nativeEvent.text;
      if(this.state.tags.length <  MAX_NO_OF_TAGS){
        this.addTagToTagArray(inputTag);
      } 
      this.__setState({
        inputTagValue :''
      });
      Keyboard.dismiss();
    }
    else{
      this.__setState({
        current_formField: currentIndex + 1
      });
    }
  }

  onRemoveTagPress = ( index  ) =>{
    this.state.tags.splice(index , 1);
    this.__setState({tags: this.state.tags});
  }

  showAddedTags = () => {
    if (!this.state.tags.length) return;
    let tagsDisplay = [],
        displayTag ='';
    for(let i = 0 ; i < this.state.tags.length ; i++  ){
      displayTag = this.getformattedTag(this.state.tags[i]);
      tagsDisplay.push(this.getTagThumbnailMarkup(i,displayTag))
    }
    return tagsDisplay;
  }

  getformattedTag = (val="") =>{
    val = val.trim()
    if(val.startsWith('#')){
      return val;
    }else{
      return "#"+val;
    }
  }

  addAnImage = () => {
    if(this.state.communityBannerUri || this.state.coverImage ) {
      return <TouchableWithoutFeedback
                disabled={this.state.isSubmitting}
                onPress={this.onImageEditClicked}>
                <Image
                  source={{ uri: this.state.communityBannerUri || this.state.coverImage }}
                  style={{width:'100%', aspectRatio: 21/9}} />
            </TouchableWithoutFeedback>
    } else {
      return <View style={inlineStyles.imageBg}>
              <TouchableOpacity onPress={this.onImageEditClicked}>
                  <View style={inlineStyles.imageWrapper}>
                    <Image source={uploadPic} style={inlineStyles.uploadPicSkipFont} />
                    <Text style={inlineStyles.imgBgTxt}>Add a community image</Text>
                    <Text style={[inlineStyles.imgBgTxt, inlineStyles.imgBgSmallTxt]}>(Min. 1500 x 642 px with max. image size of 3 MB)</Text>
                  </View>
              </TouchableOpacity>
            </View>
    }
  };

  onImageEditClicked = async () => {
    CameraPermissionsApi.requestPermission('photo').then((result) => {
      if (result == AppConfig.permisssionStatusMap.granted) {
        this.props.navigation.push('EditCommunityBanner', {
          newCommunityImage: this.newCommunityImage
        });
      } else if (result == AppConfig.permisssionStatusMap.denied || result == AppConfig.permisssionStatusMap.blocked) {
        this.__setState({
          showGalleryAccessModal: true
        });
      }
    });
  }

  newCommunityImage = (imageUri) => {
    // Delete the old image.
    this.deleteLocalBannerImage(this.localBannerImageUri);
    this.localBannerImageUri = imageUri;
    this.__setState({communityBannerUri: imageUri});
  }

  onTagsBlur = () => {
    if(this.state.tags.length >= MAX_NO_OF_TAGS ) return;
    let tagInputValue = this.state.inputTagValue;
    if(tagInputValue){
      const newState = {
        tags_error: null
      };
      this.addTagToTagArray(tagInputValue,newState);
    }
    this.__setState({
      inputTagValue :''
    })
  }

  communityName = () => {
    return <React.Fragment>
      <View style={inlineStyles.communityLabelWrapper}>
        <Text style={inlineStyles.label}>Community Name</Text>
        <Text style={inlineStyles.labelHint}>Give your community an identity! (Max 25 chars)</Text>
      </View>
      <View style={inlineStyles.inputWrapper}>
        <View style={inlineStyles.formInputWrapper}>
          <FormInput
            maxLength={NAME_MAXLENGTH}
            editable={!this.state.isSubmitting}
            onChangeText={this.onNameChange}
            fieldName="channel_name"
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
            errorStyle={inlineStyles.errorInForminput}
          />
        </View>

        <View style={inlineStyles.dynamicCountWrapper}>
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
            editable={!this.state.isSubmitting}
            onChangeText={this.onTaglineChange}
            fieldName="channel_tagline"
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
            errorStyle={inlineStyles.errorInForminput}
          />
        </View>
        <View style={inlineStyles.dynamicCountWrapper}>
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
            editable={!this.state.isSubmitting}
            multiline={true}
            onChangeText={this.onAboutInfoChange}
            fieldName="channel_description"
            textContentType="none"
            style={[inlineStyles.customTextInputBox,inlineStyles.customTextAreaBox]}
            placeholder="Write the description here..."
            returnKeyType="next"
            textAlignVertical={'top'}
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
            errorStyle={inlineStyles.errorInForminput}
          />
        </View>
        <View style={[inlineStyles.dynamicCountWrapper,inlineStyles.textAreaDynamicCountHeight]}>
          <Text style={[inlineStyles.dynamicCount]}>{this.state.about_info.length}/{ABOUT_INFO_MAXLENGTH}</Text>
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
      <View style={inlineStyles.tagsWrapper}>
        {this.showAddedTags()}
      </View>
      <View style={inlineStyles.inputWrapper}>
        <Text style={inlineStyles.hastagPrefilled}>#</Text>
        <View style={inlineStyles.formInputWrapper}>
          <FormInput
            ref={input=>{this.tagsInputRef = input}}
            editable={!this.state.isSubmitting}
            fieldName="channel_tags"
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
              this.onSubmitEditing(this.tabIndex.tags,val);
            }}
            value={this.state.inputTagValue}
            errorMsg={this.state.tags_error}
            serverErrors={this.state.server_errors}
            onBlur={this.onTagsBlur}
            errorStyle={inlineStyles.errorInForminput}
          />
        </View>
        <View style={inlineStyles.dynamicCountWrapper}>
          <Text style={inlineStyles.dynamicCount}>{this.state.tags.length}/{MAX_NO_OF_TAGS}</Text>
        </View>
      </View>
    </React.Fragment>
  };

  getTagThumbnailMarkup = (index,displayTag) =>{
    return(
      <View style={inlineStyles.tagThumbnail} key={index}>
        <Text key={index}
              numberOfLines={1}
              ellipsizeMode='tail'
              style={inlineStyles.displayTag}>
              {displayTag}
        </Text>
        <TouchableOpacity
          disabled={this.state.isSubmitting}
          onPress={()=> {this.onRemoveTagPress(index)}}
          style={inlineStyles.crosIconBackground}
        >
          <Image style={inlineStyles.crossIcon} source={CrossIconTags}></Image>
        </TouchableOpacity>
      </View>
    )
  }

  render() {
    if(!this.isCreate() && !this.isEdit()) return <View style={{flexGrow: 1, backgroundColor: Colors.white, flex:1 }} />;
    const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 30;
    return (
        <SafeAreaView forceInset={{ top: 'never' }} style={inlineStyles.safeAreaView}>
          <KeyboardAvoidingView behavior={'padding'} style={{ flex: 1 }} keyboardVerticalOffset={keyboardVerticalOffset}>
          <ScrollView
            contentContainerStyle=
              {inlineStyles.scrollViewContainerStyle}
            showsVerticalScrollIndicator={false}>
            {this.addAnImage()}
            <InlineError style={[{paddingLeft : 15, paddingTop: 5},inlineStyles.errorInForminput]}
                         fieldName={["cover_image_url" ,"cover_image_file_size" , "cover_image_height", "cover_image_width"]}
                         errorMsg={this.state.image_error} serverErrors={this.state.server_errors}/>
            <View style={inlineStyles.formWrapper}>
              {this.communityName()}
              {this.communityTagline()}
              {this.aboutTheCommunity()}


              {this.communityTags()}
              <Text style={inlineStyles.errorText}>{this.state.general_error} </Text>
              <LinearGradient
                colors={['#ff7499', '#ff5566']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={inlineStyles.linearGradient}
              >
                <TouchableOpacity
                  disabled={this.state.isSubmitting}
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
          <AllowAccessModal
            onClose={() => {
              this.__setState({
                showGalleryAccessModal: false
              });
            }}
            modalVisibility={this.state.showGalleryAccessModal}
            headerText="Library"
            accessText="Enable Library Access"
            accessTextDesc="Please allow access to photo library to select your profile picture"
            imageSrc={GalleryIcon}
            imageSrcStyle={{ height: 40, width: 40 }}
          />
          </KeyboardAvoidingView>
        </SafeAreaView>
    );
  }
}

export default CreateCommunitiesScreen;

