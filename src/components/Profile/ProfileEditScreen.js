import React from 'react';
import { View, Text, Image, TouchableOpacity, BackHandler, TouchableWithoutFeedback, Alert, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { withNavigation } from 'react-navigation';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

import { upsertUserProfileEntities, upsertLinkEntities, upsertUserEntities } from '../../actions';
import Store from '../../store';
import utilities from '../../services/Utilities';
import Colors from '../../theme/styles/Colors';
import { ActionSheet } from 'native-base';

import CameraPermissionsApi from '../../services/CameraPermissionsApi';
import AllowAccessModal from './AllowAccessModal';
import GalleryIcon from '../../assets/gallery_icon.png';
import CameraIcon from '../../assets/camera_icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';
import BackArrow from '../CommonComponents/BackArrow';
import LinearGradient from 'react-native-linear-gradient';
import pendingConfirmEmail from '../../assets/verify_email_error.png';
import confirmedEmail from '../../assets/verify_email_success.png';
import {fetchUser} from "../../helpers/helpers";
import AppConfig from '../../constants/AppConfig';

const BUTTONS = ['Take Photo', 'Choose from Library', 'Cancel'];
const OPEN_CAMERA = 0;
const OPEN_GALLERY = 1;
const CANCEL_INDEX = 2;
const BIO_HEIGHT = 75;
const EMAIL_HEIGHT = 45;

const mapStateToProps = (state, ownProps) => {
  return {
    user_name: reduxGetter.getUserName(CurrentUser.getUserId(), state) || '',
    name: reduxGetter.getName(CurrentUser.getUserId(), state) || '',
    bio: reduxGetter.getBio(CurrentUser.getUserId(), state) || '',
    email: reduxGetter.getBio(CurrentUser.getUserId(), state) || '',
    link: reduxGetter.getLink(reduxGetter.getUserLinkId(CurrentUser.getUserId(), state), state) || '',
    profilePicture: reduxGetter.getProfileImage(reduxGetter.getProfileImageId(CurrentUser.getUserId(), state), state, AppConfig.profileImageConstants.originalImageWidth)
  };
};

const btnPreText = 'Save Profile';
const btnPostText = 'Saving...';

class ProfileEdit extends React.PureComponent {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerBackTitle: null,
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            const onCancel = navigation.getParam('onCancel');
            if (onCancel) {
              onCancel();
            } else {
              navigation.goBack();
            }
          }}
        >
          <BackArrow forcePaddingLeft={true} />
        </TouchableOpacity>
      ),
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
      headerTitle: reduxGetter.getName(CurrentUser.getUserId()),
      headerTitleStyle: {
        fontFamily: 'AvenirNext-Medium'
      },
    };
  };

  constructor(props) {
    super(props);

    this.tabIndex = {
      name: 1,
      username: 2
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
      emailAddress: this.props.navigation.getParam('email'),
      isVerifiedEmail: this.props.navigation.getParam('isVerifiedEmail'),
      link: this.props.link,
      showGalleryAccessModal: false,
      showCameraAccessModal: false,
      current_formField: 0,
      ...this.defaults
    };

    this.onEmailSaveDelegate = this.props.navigation.getParam('onEmailSave');

    this.savedEmail= this.props.navigation.getParam('email');
  }

  componentDidMount() {
    this.props.navigation.setParams({
      onCancel: this.onCancel
    });
    BackHandler.addEventListener('hardwareBackPress', this.onCancel);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onCancel);
  }

  getImageSrc = () => {
    if (this.props.profilePicture) {
      return (
        <Image
          style={[{ backgroundColor: Colors.gainsboro }, inlineStyles.profileEditIconSkipFont]}
          source={{ uri: this.props.profilePicture }}
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
    if (this.state.name.length > 30 || this.state.name.length < 2) {
      this.setState({
        name_error: ostErrors.getUIErrorMessage('name_min_max')
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
      email: this.state.emailAddress,
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

    const userProfileEntity = reduxGetter.getUserProfile(CurrentUser.getUserId());
    if (!userProfileEntity) return;
    if (typeof this.state.bio != 'undefined') {
      const bio = userProfileEntity['bio'] || {};
      bio['text'] = this.state.bio+" ";
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

    this.props.navigation.goBack();
  }

  onSubmit() {
    this.clearErrors();

    if (this.validateProfileInput()) {
      this.setState({ btnText: btnPostText });
      return new PepoApi(`/users/${CurrentUser.getUserId()}/profile`)
        .post(this.getParams())
        .then((res) => {
          this.setState({ btnText: btnPreText });
          if (res && res.success) {
            this.updateProfileData();
            fetchUser(CurrentUser.getUserId());
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
      this.props.link != this.state.link
    ) {
      Alert.alert(
        'Discard changes?',
        'You will lose all the changes if you go back now.',
        [
          { text: 'Keep Editing', onPress: () => {} },
          {
            text: 'Discard',
            onPress: () => {
              this.props.navigation.goBack();
            }
          }
        ],
        { cancelable: false }
      );
    } else {
      this.props.navigation.goBack();
    }
    return true;
  };

  onBioChangeDelegate = (val) => {
    this.setState({ bio: val });
  };

  onBioFocus = () => {
    this.setState({
      current_formField: 0
    });
    this.props.navigation.push('BioScreen', {
      onChangeTextDelegate: this.onBioChangeDelegate,
      initialValue: this.state.bio
    });
  };

  // onEmailChangeDelegate = (val) => {
  //   this.setState({ emailAddress: val });
  // };

  onEmailSentDelegate = (val) =>{
    this.setState({ emailAddress: val });
    this.savedEmail = val;
    this.onEmailSaveDelegate &&  this.onEmailSaveDelegate( val );
  }

  onEmailFocus = () => {
    this.props.navigation.push('EmailScreen', {
    //  onChangeTextDelegate: this.onEmailChangeDelegate,
      initialValue: this.state.emailAddress,
      savedEmail: this.savedEmail,
      onEmailSentDelegate: this.onEmailSentDelegate
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
    CameraPermissionsApi.requestPermission('camera').then((result) => {
      if (result == AppConfig.permisssionStatusMap.granted) {
        this.props.navigation.push('CaptureImageScreen');
      } else if ( result == AppConfig.permisssionStatusMap.denied || result == AppConfig.permisssionStatusMap.blocked) {
        this.setState({
          showCameraAccessModal: true
        });
      }
    });
  };

  openGallery = async () => {
    CameraPermissionsApi.requestPermission('photo').then((result) => {
      if (result == AppConfig.permisssionStatusMap.granted) {
        this.props.navigation.push('ImageGalleryScreen');
      } else if (result == AppConfig.permisssionStatusMap.denied || result == AppConfig.permisssionStatusMap.blocked) {
        this.setState({
          showGalleryAccessModal: true
        });
      }
    });
  };

  render() {
    return (
      <View style={{backgroundColor: Colors.white}}>
        <KeyboardAwareScrollView
          enableOnAndroid={true}
          bounces={false}
          contentContainerStyle={{
            marginTop: 10,
            padding: 15,
            paddingBottom: 50,
            backgroundColor: Colors.white
          }}
          showsVerticalScrollIndicator={false}
        >
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

          <Text style={[Theme.TextInput.labelStyle]}>Name</Text>
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
              this.setState({
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

          <Text style={[Theme.TextInput.labelStyle]}>Username</Text>
          <FormInput
            editable={true}
            autoCapitalize="none"
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
              Keyboard.dismiss();
              this.onSubmitEditing(this.tabIndex.username);
            }}
            isFocus={this.state.current_formField == this.tabIndex.username}
            onFocus={() => {
              this.setState({
                current_formField: this.tabIndex.username
              });
            }}
            value={this.state.user_name}
            errorMsg={this.state.user_name_error}
            serverErrors={this.state.server_errors}
          />

          <Text style={[Theme.TextInput.labelStyle]}>Email Address</Text>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity disabled={this.state.isVerifiedEmail}
              onPress={multipleClickHandler(() => this.onEmailFocus())}
              style={[inlineStyles.clickWrapper,{height : EMAIL_HEIGHT}]}
            >

            </TouchableOpacity>
            <FormInput
              editable={false}
              fieldName="email"
              textContentType="none"
              style={[
                Theme.TextInput.textInputStyle,
                !this.state.isVerifiedEmail
                  ? { borderColor: Colors.wildWatermelon2 }
                  : { backgroundColor: Colors.whiteSmoke }
              ]}
              placeholder="Email"
              returnKeyType="next"
              returnKeyLabel="Next"
              placeholderTextColor="#ababab"
              blurOnSubmit={false}
              value={this.state.emailAddress}
              serverErrors={this.state.server_errors}
              autoCapitalize={'none'}
              isFocus={false}
            />
            <Image
              source={!this.state.isVerifiedEmail ? pendingConfirmEmail : confirmedEmail}
              style={{
                width: 30,
                height: 30,
                position: 'absolute',
                right: 10,
                top: 13
              }}
            />
          </View>

          <Text style={[Theme.TextInput.labelStyle]}>Bio</Text>
          <View style={{position: "relative"}}>
            <TouchableOpacity style={[inlineStyles.clickWrapper,{height : BIO_HEIGHT}]}
                              onPress={multipleClickHandler(() => this.onBioFocus())}>
            </TouchableOpacity>
            <FormInput
              editable={false}
              fieldName="bio"
              textContentType="none"
              style={[Theme.TextInput.textInputStyle, { height: BIO_HEIGHT, paddingVertical: 15 }]}
              placeholder="Bio"
              returnKeyType="next"
              returnKeyLabel="Next"
              placeholderTextColor="#ababab"
              blurOnSubmit={false}
              maxLength={100}
              value={this.state.bio}
              serverErrors={this.state.server_errors}
              isFocus={false}
              //onFocus={multipleClickHandler(() => this.onBioFocus())}
            />
          </View>


          <Text style={[Theme.TextInput.labelStyle]}>Link</Text>
          <FormInput
            editable={true}
            autoCapitalize="none"
            onChangeText={(link) => this.setState({ link, error: null, link_error: null })}
            fieldName="link"
            textContentType="none"
            style={[Theme.TextInput.textInputStyle]}
            placeholder="Link"
            returnKeyType="done"
            returnKeyLabel="Done"
            placeholderTextColor="#ababab"
            blurOnSubmit={false}
            onSubmitEditing={() => {
              Keyboard.dismiss();
            }}
            value={this.state.link}
            serverErrors={this.state.server_errors}
          />

          <LinearGradient
            colors={['#ff7499', '#ff5566']}
            locations={[0, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{ marginTop: 25, borderRadius: 3 }}
          >
            <TouchableOpacity onPress={this.onSubmit.bind(this)} style={[Theme.Button.btn, { borderWidth: 0 }]}>
              <Text style={[Theme.Button.btnPinkText, { textAlign: 'center' }]}>{this.state.btnText}</Text>
            </TouchableOpacity>
          </LinearGradient>

          <Text>{this.state.general_error}</Text>
          <AllowAccessModal
            onClose={() => {
              this.setState({
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
          <AllowAccessModal
            onClose={() => {
              this.setState({
                showCameraAccessModal: false
              });
            }}
            modalVisibility={this.state.showCameraAccessModal}
            headerText="Camera"
            accessText="Enable Camera Access"
            accessTextDesc="Allow access to your camera and microphone to take video "
            imageSrc={CameraIcon}
          />
        </KeyboardAwareScrollView>
      </View>
    );
  }
}

export default connect(mapStateToProps)(withNavigation(ProfileEdit));
