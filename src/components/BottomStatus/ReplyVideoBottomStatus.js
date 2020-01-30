import reduxGetter from "../../services/ReduxGetters";
import { connect } from 'react-redux';
import Base from "./Base"
import { withNavigation } from "react-navigation";
import AppConfig from "../../constants/AppConfig";

const mapStateToProps = (state, ownProps) => {
    return {
      userName: reduxGetter.getUserName(ownProps.userId, state),
      name: reduxGetter.getName(ownProps.userId, state),
      entityDescriptionId : reduxGetter.getReplyDescriptionId(ownProps.entityId),
      description: reduxGetter.getVideoDescription(reduxGetter.getReplyDescriptionId(ownProps.entityId, state), state),
      link: reduxGetter.getVideoLink(reduxGetter.getReplyLinkId(ownProps.entityId, state), state),
      supporters: reduxGetter.getReplySupporters(ownProps.entityId),
      totalBt: reduxGetter.getReplyBt(ownProps.entityId, state),
      cts : reduxGetter.getReplyCTS(ownProps.entityId, state),
      entityKind : AppConfig.videoType.reply
    };
  };

const ReplyVideoBottomStatus = connect(mapStateToProps)( withNavigation( Base ));

export default ReplyVideoBottomStatus;
