import reduxGetter from "../../services/ReduxGetters";
import { connect } from 'react-redux';
import Base from "./Base"
import { withNavigation } from "react-navigation";
import DataContract from "../../constants/DataContract";

const mapStateToProps = (state, ownProps) => {
    return {
      userName: reduxGetter.getUserName(ownProps.userId, state),
      name: reduxGetter.getName(ownProps.userId, state),
      entityDescriptionId : reduxGetter.getVideoDescriptionId(ownProps.entityId),
      description: reduxGetter.getVideoDescription(reduxGetter.getVideoDescriptionId(ownProps.entityId, state), state),
      link: reduxGetter.getVideoLink(reduxGetter.getVideoLinkId(ownProps.entityId, state), state),
      supporters: reduxGetter.getVideoSupporters(ownProps.entityId),
      totalBt: reduxGetter.getVideoBt(ownProps.entityId, state),
      cts: reduxGetter.getVideoCTS(ownProps.entityId,  state),
      entityKind : DataContract.knownEntityTypes.video
    };
  };

const VideoBottomStatus = connect(mapStateToProps)( withNavigation( Base ));

export default VideoBottomStatus ;
