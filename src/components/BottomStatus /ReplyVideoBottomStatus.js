import reduxGetter from "../../services/ReduxGetters";
import { connect } from 'react-redux';
import Base from "./Base"

const mapStateToProps = (state, ownProps) => {
    return {
      userName: reduxGetter.getUserName(ownProps.userId, state),
      name: reduxGetter.getName(ownProps.userId, state),
      description: reduxGetter.getVideoDescription(reduxGetter.getVideoDescriptionId(ownProps.videoId, state), state),
      link: reduxGetter.getVideoLink(reduxGetter.getVideoLinkId(ownProps.videoId, state), state),
      supporters: reduxGetter.getVideoSupporters(ownProps.videoId),
      totalBt: reduxGetter.getVideoBt(ownProps.videoId, state)
    };
  };

  const ReplyVideoBottomStatus = connect(mapStateToProps)(Base);
  export default ReplyVideoBottomStatus;