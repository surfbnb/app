
import reduxGetter from "../../services/ReduxGetters";
import { connect } from 'react-redux';
import Base from "./Base";
import AppConfig from "../../constants/AppConfig";

const mapStateToProps = (state, ownProps) => {
    return {
      videoImgUrl: reduxGetter.getVideoImgUrl(ownProps.videoId, state, AppConfig.userVideos.userScreenCoverImageWidth ),
      videoUrl: reduxGetter.getVideoUrl(ownProps.videoId, state),
      loginPopover: ownProps.isActive && state.login_popover.show
    };
};

const FanVideo =  connect(mapStateToProps)(Base);
export default FanVideo;