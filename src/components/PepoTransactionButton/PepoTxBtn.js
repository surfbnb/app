import { connect } from 'react-redux';
import reduxGetter from "../../services/ReduxGetters";
import utilities from "../../services/Utilities";
import CurrentUser from "../../models/CurrentUser";
import Base from "./Base";

const mapStateToProps = (state, ownProps) => ({
    balance: state.balance,
    disabled: state.executeTransactionDisabledStatus,
    isVideoUserActivated: utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
    supporters: reduxGetter.getVideoSupporters(ownProps.videoId),
    isSupporting: reduxGetter.isVideoSupported(ownProps.videoId),
    totalBt: reduxGetter.getVideoBt(ownProps.videoId, state),
    isCurrentUserActivated: CurrentUser.isUserActivated()
  });

  const PepoTxBtn =   connect(mapStateToProps)(Base);
  export default PepoTxBtn;