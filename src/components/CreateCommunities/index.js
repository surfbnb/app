import React, { Component } from 'react';
import {View, StatusBar, Text, SafeAreaView, ScrollView, Image, TextInput, TouchableOpacity} from 'react-native';
import Colors from "../../theme/styles/Colors";
import inlineStyles from "../CreateCommunities/styles";
import uploadPic from "../../assets/new-community-upload-icon.png";
import Theme from "../../theme/styles";
import CustomTextInput from "../CommonComponents/TagsInput/CustomTextInput";
import LinearGradient from "react-native-linear-gradient";

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
    this.placeholderText= "Write Here..."
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

  communityName = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>Community Name</Text>
        <Text style={inlineStyles.labelHint}>Give your community an identity! (Max 20 chars)</Text>
      </View>
      <CustomTextInput
        ref={this.setTextInputRef}
        textInputStyles={inlineStyles.customTextInputBox}
        placeholderText={this.placeholderText}
        autoFocus={this.props.autoFocus}
        maxLength={20}
      />
    </React.Fragment>
  };

  communityTagline = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>Community Tagline</Text>
        <Text style={inlineStyles.labelHint}>Something which shows what your community is about (Max 45 chars)</Text>
      </View>
      <CustomTextInput
        ref={this.setTextInputRef}
        textInputStyles={inlineStyles.customTextInputBox}
        placeholderText={this.placeholderText}
        autoFocus={this.props.autoFocus}
        maxLength={45}
      />
    </React.Fragment>
  };

  aboutTheCommunity = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>About the community</Text>
        <Text style={inlineStyles.labelHint}>Something which best describes it (Max. 400 chars)</Text>
      </View>
      <CustomTextInput
        ref={this.setTextInputRef}
        textInputStyles={[inlineStyles.customTextInputBox, {height: 75}]}
        placeholderText={'Write the description here...'}
        autoFocus={this.props.autoFocus}
        maxLength={400}
      />
    </React.Fragment>
  };

  communityTags = () => {
    return <React.Fragment>
      <View style={{marginTop:10, marginBottom: 8}}>
        <Text style={inlineStyles.label}>Community Tags</Text>
        <Text style={inlineStyles.labelHint}>These tags place videos in your community. Learn More</Text>
      </View>
      <CustomTextInput
        ref={this.setTextInputRef}
        textInputStyles={inlineStyles.customTextInputBox}
        placeholderText={'Enter Tag'}
        autoFocus={this.props.autoFocus}
      />
    </React.Fragment>
  };

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
              {this.communityTags()}
              <LinearGradient
                colors={['#ff7499', '#ff5566']}
                locations={[0, 1]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ marginTop: 25, borderRadius: 3 }}
              >
                <TouchableOpacity
                  onPress={() => {}}
                  style={[Theme.Button.btn, { borderWidth: 0 }]}
                >
                  <Text
                    style={[
                      Theme.Button.btnPinkText,
                      { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                    ]}
                  >
                    Submit
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
