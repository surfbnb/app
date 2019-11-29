import reduxGetter from '../../../services/ReduxGetters';
import { connect } from 'react-redux';
import Base from "./Base"

const mapStateToProps = (state , ownProps) => {
    return {
      canReply : reduxGetter.isReplyShareable(ownProps.entityId , state)
    }
};

const ReplyShareIcon = connect(mapStateToProps)(Base);
export default ReplyShareIcon;