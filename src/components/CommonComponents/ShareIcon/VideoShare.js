import reduxGetter from '../../../services/ReduxGetters';
import { connect } from 'react-redux';
import Base from "./Base"


const mapStateToProps = (state , ownProps) => {
    return {
      canReply : reduxGetter.isVideoShareable(ownProps.entityId , state)
    }
};

const VideoShareIcon = connect(mapStateToProps)(Base);
export default VideoShareIcon;