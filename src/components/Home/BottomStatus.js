import React, { PureComponent } from 'react';
import { View, Text, Image } from 'react-native';
import { connect } from 'react-redux';

import inlineStyles from './styles';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import reduxGetter from '../../services/ReduxGetters';

import multipleClickHandler from '../../services/MultipleClickHandler';

const mapStateToProps = (state, ownProps) => {
  return {
    userName: reduxGetter.getUserName(ownProps.userId, state),
    name: reduxGetter.getName(ownProps.userId, state),
    bio: reduxGetter.getBio(ownProps.userId, state),
    //Temp Code 
    videoSize: reduxGetter.getVideoSize(ownProps.videoId, state ),
    videoSizeR: reduxGetter.getVideoSize(ownProps.videoId, state , "576w"),
    videoImageSize : reduxGetter.getImageSize(ownProps.videoId, state ),
    videoImageSizeR : reduxGetter.getImageSize(ownProps.videoId, state , "576w"),
    //Temp code 
  };
};

class BottomStatus extends PureComponent {
  constructor(props) {
    super(props);
  }

  onWrapperClick = (e) => {
    this.props.onWrapperClick && this.props.onWrapperClick();
  };

  render() {
    return (
        <TouchableWithoutFeedback
          onPress={multipleClickHandler(() => this.onWrapperClick())}
          pointerEvents={'auto'}
          style={inlineStyles.bottomBg}
        >
          <View style={{ flex: 1, paddingVertical: 12 }}>
            <Text style={[inlineStyles.handle]}
                  ellipsizeMode={'tail'}
                  numberOfLines={1}
            >
              {`@${this.props.userName}`}
              {/* TODO remove //Temp Start*/}
              {/* { }V-{this.props.videoSize}:{this.props.videoSizeR}  I-{this.props.videoImageSize} */}
              {/* TODO remove //Temp End*/}
            </Text>
            {this.props.bio ? (
              <Text
                style={[{ fontSize: 14, flexWrap: 'wrap' }, inlineStyles.bottomBgTxt]}
                ellipsizeMode={'tail'}
                numberOfLines={3}
              >
                {this.props.bio}
              </Text>
            ) : (
              <Text />
            )}
          </View>
        </TouchableWithoutFeedback>
    );
  }
}

export default connect(mapStateToProps)(BottomStatus);