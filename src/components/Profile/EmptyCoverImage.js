import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

import reduxGetter from '../../services/ReduxGetters';
import inlineStyles from './styles';
import videoIcon from '../../assets/video_icon.png';
import multipleClickHandler from '../../services/MultipleClickHandler';

const mapStateToProps = (state, ownProps) => {
  return {
    coverImageId: reduxGetter.getUserCoverImageId(ownProps.userId, state)
  };
};

class EmptyCoverImage extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  uploadVideo = () => {
    this.props.uploadVideo && this.props.uploadVideo();
  };

  render() {
    return !this.props.coverImageId ? (
      <View style={inlineStyles.emptyCoverWrapper}>
        <Text style={inlineStyles.updateText}>Update your fans!</Text>
        <TouchableOpacity
          style={inlineStyles.videoIconBtn}
          onPress={multipleClickHandler(() => {
            this.uploadVideo();
          })}
        >
          <Image style={{ width: 19, height: 15 }} source={videoIcon}></Image>
        </TouchableOpacity>
        <Text style={inlineStyles.creatVideoText}>Create a Video</Text>
      </View>
    ) : (
      <View />
    );
  }
}

export default connect(mapStateToProps)(EmptyCoverImage);
