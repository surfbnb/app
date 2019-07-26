import React from 'react';
import { View, Text, Image, TouchableOpacity, PermissionsAndroid, Platform, Alert } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
// import { NavigationEvents } from 'react-navigation';

import inlineStyles from './styles';
import Theme from '../../theme/styles';
import profileEditIcon from '../../assets/profile_edit_icon.png';
import default_user_icon from '../../assets/default_user_icon.png';
import FormInput from '../../theme/components/FormInput';
import reduxGetter from '../../services/ReduxGetters';
import { ostErrors } from '../../services/OstErrors';
import PepoApi from '../../services/PepoApi';
import ProfilePlusIcon from '../../assets/red_plus_icon.png';
import CurrentUser from '../../models/CurrentUser';

import { updateCurrentUser, upsertUserProfileEntities, upsertLinkEntities, upsertUserEntities } from '../../actions';
import Store from '../../store';
import utilities from '../../services/Utilities';
import Colors from '../../theme/styles/Colors';
import { ActionSheet } from 'native-base';
import FastImage from 'react-native-fast-image';

import CameraPermissionsApi from '../../services/CameraPermissionsApi';
import AllowAccessModal from '../Profile/AllowAccessModal';
import GalleryIcon from '../../assets/gallery_icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';

const BUTTONS = ['Take Photo', 'Choose from Library', 'Cancel'];
const OPEN_CAMERA = 0;
const OPEN_GALLERY = 1;
const CANCEL_INDEX = 2;

const mapStateToProps = (state, ownProps) => {
  return {
    user_name: reduxGetter.getUserName(ownProps.userId, state) || '',
    name: reduxGetter.getName(ownProps.userId, state) || '',
    bio: reduxGetter.getBio(ownProps.userId, state) || '',
    link: reduxGetter.getLink(reduxGetter.getUserLinkId(ownProps.userId, state), state) || '',
    profilePicture: reduxGetter.getImage(reduxGetter.getProfileImageId(ownProps.userId, state), state)
  };
};

const btnPreText = 'Save Profile';
const btnPostText = 'Saving...';

class ProfileEdit extends React.PureComponent {
  constructor(props) {
    super(props);

    this.tabIndex = {
      name: 1,
      username: 2,
      bio: 3,
      link: 4
    };

    this.defaults = {
      name_error: null,
      user_name_error: null,
      server_errors: {},
      general_error: null,
      btnText: btnPreText
    };

    this.state = {
      name: this.props.name,
      user_name: this.props.user_name,
      bio: this.props.bio,
      link: this.props.link,
      current_formField: 0,
      showAccessModal: false,
      ...this.defaults
    };
  }

  componentDidMount() {
    if (Platform.OS == 'ios') {
      CameraPermissionsApi.checkPermission('photo').then((response) => {
        if (response == 'authorized') {
          this.setState({
            showAccessModal: false
          });
        }
      });
    }
  }

  getImageSrc = () => {
    console.log(this.props.profilePicture, 'this.props.profilePicture');
    if (this.props.profilePicture) {
      return (
        <FastImage
          style={[{ backgroundColor: Colors.gainsboro }, inlineStyles.profileEditIconSkipFont]}
          source={{ uri: this.props.profilePicture, priority: FastImage.priority.high }}
        />
      );
    } else {
      return <Image style={inlineStyles.profileEditIconSkipFont} source={default_user_icon}></Image>;
    }
  };

  onSubmitEditing(currentIndex) {
    this.setState({
      current_formField: currentIndex + 1
    });
  }

  validateProfileInput() {
    let isValid = true;
    if (!this.state.name) {
      this.setState({
        name_error: ostErrors.getUIErrorMessage('name')
      });
      isValid = false;
    }
    if (!this.state.user_name) {
      this.setState({
        user_name_error: ostErrors.getUIErrorMessage('user_name')
      });
      isValid = false;
    }
    if (this.state.user_name.length > 15 || this.state.user_name.length < 1) {
      this.setState({
        user_name_error: ostErrors.getUIErrorMessage('user_name_min_max')
      });
      isValid = false;
    }
    return isValid;
  }

  clearErrors() {
    this.setState(this.defaults);
  }

  getParams() {
    return {
      name: this.state.name,
      user_name: this.state.user_name,
      bio: this.state.bio,
      link: this.state.link
    };
  }

  updateProfileData() {
    const currentUserObj = CurrentUser.getUser();
    if (this.state.name) {
      currentUserObj['name'] = this.state.name;
    }
    if (this.state.user_name) {
      currentUserObj['user_name'] = this.state.user_name;
    }
    Store.dispatch(upsertUserEntities(utilities._getEntityFromObj(currentUserObj)));

    const userProfileEntity = reduxGetter.getUserProfile(this.props.userId);
    if (!userProfileEntity) return;
    if (typeof this.state.bio != 'undefined') {
      const bio = userProfileEntity['bio'] || {};
      bio['text'] = this.state.bio;
      userProfileEntity['bio'] = bio;
    }

    if (typeof this.state.link != 'undefined') {
      const linkId = `link_${Date.now()}`;
      let linkObj = {
        id: linkId,
        url: this.state.link
      };
      Store.dispatch(upsertLinkEntities(utilities._getEntityFromObj(linkObj)));
      let userProfileLinkIds = userProfileEntity['link_ids'] || [];
      userProfileLinkIds.unshift(linkId);
    }

    Store.dispatch(upsertUserProfileEntities(utilities._getEntityFromObj(userProfileEntity)));
  }

  onSubmit() {
    this.clearErrors();
    if (this.validateProfileInput()) {
      this.setState({ btnText: btnPostText });
      return new PepoApi(`/users/${this.props.userId}/profile`)
        .post(this.getParams())
        .then((res) => {
          this.setState({ btnText: btnPreText });
          if (res && res.success) {
            this.updateProfileData();
            this.props.hideProfileEdit && this.props.hideProfileEdit(res);
            return;
          } else {
            this.onServerError(res);
          }
        })
        .catch((error) => {
          this.setState({ btnText: btnPreText });
        });
    }
  }

  onCancel = () => {
    if (
      this.props.name != this.state.name ||
      this.props.user_name != this.state.user_name ||
      this.props.bio != this.state.bio ||
      this.props.bio != this.state.bio
    ) {
      Alert.alert(
        'Discard changes?',
        'You will lose all the changes if you go back now.',
        [
          { text: 'Keep Editing', onPress: () => {} },
          {
            text: 'Discard',
            onPress: () => {
              this.onDiscard();
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      this.props.hideProfileEdit();
    }
  };

  onDiscard() {
    this.props.hideProfileEdit();
  }

  onBioChangeDelegate = (val) => {
    this.setState({ bio: val });
  };

  onBioFocus = () => {
    this.state.current_formField = 0;
    this.props.navigation.push('BioScreen', {
      onChangeTextDelegate: this.onBioChangeDelegate,
      initialValue: this.state.bio
    });
  };

  onServerError(res) {
    const errorMsg = ostErrors.getErrorMessage(res);
    this.setState({ server_errors: res, general_error: errorMsg });
  }

  showActionSheetWithOptions = () => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX
      },
      (buttonIndex) => {
        buttonIndex === OPEN_CAMERA && this.openCamera();
        buttonIndex === OPEN_GALLERY && this.openGallery();
      }
    );
  };

  openCamera = async () => {
    let response = await CameraPermissionsApi.checkPermission('camera');
    if (Platform.OS == 'android') {
      //can ask permissions multiple times on android
      CameraPermissionsApi.requestPermission('camera').then((result) => {
        //if do not ask again is selected then 'restricted' is returned and permission dialog does not appear again
        if (result == 'authorized' || result == 'restricted') {
          this.props.navigation.push('CaptureImageScreen');
        }
      });
    } else if (Platform.OS == 'ios') {
      if (response == 'undetermined') {
        //can ask only once in ios i.e first time
        CameraPermissionsApi.requestPermission('camera').then((result) => {
          if (result == 'authorized') {
            this.props.navigation.push('CaptureImageScreen');
          }
        });
      } else {
        //redirect inside irrespective of response as enable access modal is handled inside the screen
        this.props.navigation.push('CaptureImageScreen');
      }
    }
  };

  openGallery = async () => {
    let response = await CameraPermissionsApi.checkPermission('photo');
    CameraPermissionsApi.requestPermission('photo').then((result) => {
      if (result == 'authorized' || result == 'restricted') {
        this.props.navigation.push('ImageGalleryScreen');
      }
    });
    if (Platform.OS == 'ios' && response == 'denied') {
      //show enable access modal only in case of ios as in android multiple times permission dialog can appear
      this.setState({
        showAccessModal: true
      });
    }
  };

  render() {
    return (
      <View style={{ marginTop: 20, paddingBottom: 100 }}>
        <View style={inlineStyles.editProfileContainer}>
          {this.getImageSrc()}
          <TouchableOpacity style={inlineStyles.editProfileIconTouch} onPress={this.showActionSheetWithOptions}>
            <View style={inlineStyles.editProfileIconPos}>
              <Image
                style={{ width: 13, height: 13 }}
                source={this.props.profilePicture ? profileEditIcon : ProfilePlusIcon}
              ></Image>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={{}}>Name</Text>
        <FormInput
          editable={true}
          onChangeText={(name) => this.setState({ name, error: null, name_error: null })}
          fieldName="name"
          textContentType="none"
          style={[Theme.TextInput.textInputStyle]}
          placeholder="Name"
          returnKeyType="next"
          returnKeyLabel="Next"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
          isFocus={this.state.current_formField == this.tabIndex.name}
          onFocus={() => {
            this.state.current_formField = this.tabIndex.name;
          }}
          value={this.state.name}
          errorMsg={this.state.name_error}
          serverErrors={this.state.server_errors}
        />

        <Text style={{}}>Username</Text>
        <FormInput
          editable={true}
          onChangeText={(user_name) => this.setState({ user_name, error: null, user_name_error: null })}
          fieldName="user_name"
          textContentType="none"
          style={[Theme.TextInput.textInputStyle]}
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
          value={this.state.user_name}
          errorMsg={this.state.user_name_error}
          serverErrors={this.state.server_errors}
        />

        <Text style={{}}>Bio</Text>
        <FormInput
          editable={true}
          fieldName="bio"
          textContentType="none"
          style={[Theme.TextInput.textInputStyle, { marginBottom: 10, height: 75, paddingVertical: 15 }]}
          placeholder="Bio"
          returnKeyType="next"
          returnKeyLabel="Next"
          placeholderTextColor="#ababab"
          blurOnSubmit={false}
          maxLength={100}
          onSubmitEditing={() => {
            this.onSubmitEditing(this.tabIndex.bio);
          }}
          isFocus={this.state.current_formField == this.tabIndex.bio}
          onFocus={multipleClickHandler(() => this.onBioFocus())}
          value={this.state.bio}
          serverErrors={this.state.server_errors}
        />

        <Text style={{}}>Link</Text>
        <FormInput
          editable={true}
          onChangeText={(link) => this.setState({ link, error: null, link_error: null })}
          fieldName="link"
          textContentType="none"
          style={[Theme.TextInput.textInputStyle]}
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
          value={this.state.link}
          serverErrors={this.state.server_errors}
        />

        <TouchableOpacity onPress={this.onSubmit.bind(this)} style={[Theme.Button.btn, Theme.Button.btnPink]}>
          <Text style={[Theme.Button.btnPinkText, { textAlign: 'center' }]}>{this.state.btnText}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={this.onCancel}
          style={[Theme.Button.btn, Theme.Button.btnPinkSecondary, { marginTop: 10 }]}
        >
          <Text style={[Theme.Button.btnPinkSecondaryText, { textAlign: 'center' }]}>Cancel</Text>
        </TouchableOpacity>
        {/*//TODO error styling */}
        <Text>{this.state.general_error}</Text>
        <AllowAccessModal
          onClose={() => {}}
          modalVisibility={this.state.showAccessModal}
          headerText="Library"
          accessText="Enable Library Access"
          accessTextDesc="Please allow access to photo library to select your profile picture"
          imageSrc={GalleryIcon}
          imageSrcStyle={{ height: 40, width: 40 }}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(ProfileEdit));
