import React , {PureComponent} from "react";
import {Text} from "react-native";
import {connect} from "react-redux";
import ReduxGetters from '../../../services/ReduxGetters';

const mapStateToProps = (state, ownProps) => {
  return {
    videoReplyCount:   ReduxGetters.getVideoReplyCount(ownProps.videoId)
  }
};

class VideoReplyCount extends PureComponent {

  constructor(props){
    super(props);
  }

  render() {
    return <Text style={this.props.style} numberOfLines={1} >
            {this.props.videoReplyCount} {this.props.showReplyText ?  this.props.videoReplyCount > 1 ? 'Replies' : 'Reply'  : ''}
           </Text>
  }
}

export default connect(mapStateToProps)(VideoReplyCount);
