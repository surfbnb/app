import React, { Component } from 'react';
import {View} from 'react-native';
import { connect } from 'react-redux';
import ProfilePicture from "../../ProfilePicture";
import reduxGetters from '../../../services/ReduxGetters';
import inlineStyles from './styles';

const mapStateToProps = (state, ownProps) => {
  return {
    seen: reduxGetters.isVideoSeen( reduxGetters.getReplyEntityId(ownProps.replyDetailId))
  };
};

class SingleBubble extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    return <View style={ [ !this.props.seen ? inlineStyles.bubbleShadow: {}, {marginLeft: -20}]}>
      <ProfilePicture userId={this.props.userId}
                      style={inlineStyles.bubbleSize}
      />
    </View>
  }
  isActiveOrUnseen = () => {
    return ! this.props.seen || this.props.isActive();
  }

}

//make this component available to the app
export default connect(mapStateToProps)(SingleBubble);
