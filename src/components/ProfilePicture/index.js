import React from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import reduxGetter from '../../services/ReduxGetters';
import Colors from '../../theme/styles/Colors'; //'./src/theme/styles/Colors';
import inlineStyle from './styles';
import profilePicture from '../../assets/default_user_icon.png';
import AppConfig from "../../constants/AppConfig";

const mapStateToProps = (state, ownProps) => {
  return {
    profilePicture: ownProps.userId ? reduxGetter.getProfileImage(reduxGetter.getProfileImageId(ownProps.userId, state), state, AppConfig.profileImageConstants.originalImageWidth) :
    reduxGetter.getProfileImage(ownProps.pictureId, state, AppConfig.profileImageConstants.originalImageWidth)
  };
};
let getImageSrc = (props) => {
  let src;
  if ( props.profilePicture) {
    src = { uri: props.profilePicture };
  } else {
    src = profilePicture;
  }

  return <Image style={[{ backgroundColor: Colors.gainsboro} , inlineStyle.profileImageSkipFont, props.style]} source={src} />;
};

export default connect(mapStateToProps)(getImageSrc);
