import { updateExecuteTransactionStatus, updateBalance, upsertVideoStatEntities } from '../../actions';
import reduxGetter from "../../services/ReduxGetters";
import CurrentUser from "../../models/CurrentUser";
import utilities from "../../services/Utilities";
import { connect } from 'react-redux';
import Store from '../../store';
import Base from "./Base";

const mapStateToProps = (state, ownProps) => ({
    balance: state.balance,
    disabled: state.executeTransactionDisabledStatus,
    isVideoUserActivated: utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
    isCurrentUserActivated: CurrentUser.isUserActivated() ,
    supporters: "", //TODO
    isSupporting:"", //TODO
    totalBt: "", //TODO
    videoId : "", //TODO
  });

class ReplyPepoTxBtn extends Base {

    constructor(props){
        super(props);
    }

    getSdkMetaProperties() {
      const metaProperties = clone(appConfig.metaProperties);
      if (this.props.videoId) {
        metaProperties['name'] = 'pepo_on_reply';
        metaProperties['details'] = `rdi_${this.props.replyId}`;
      }
      return metaProperties;
    }

    getDropPixel(){
      //TODO 
      return {
        e_entity: 'video',
        e_action: 'contribution',
        e_data_json: {
          video_id: this.props.videoId,
          profile_user_id: this.props.userId,
          amount: this.btAmount
        },
        p_type: 'reply'
      }
    }

    reduxUpdate(isTXBtnDisabled, balance, totalBt, supporters) {
      //TODO
      if (isTXBtnDisabled !== undefined) {
        Store.dispatch(updateExecuteTransactionStatus(isTXBtnDisabled));
      }
  
      if (balance) {
        balance = pricer.getToDecimal(balance);
        Store.dispatch(updateBalance(balance));
      }
  
      let videoStats = reduxGetter.getVideoStats(this.props.videoId),
        updateVideoStats = false;
      if (totalBt && totalBt > 0) {
        videoStats['total_amount_raised_in_wei'] = Pricer.getToDecimal(totalBt);
        updateVideoStats = true;
      }
  
      if (supporters && !this.props.isSupporting) {
        videoStats['total_contributed_by'] = supporters;
        updateVideoStats = true;
      }
  
      if (updateVideoStats) {
        Store.dispatch(upsertVideoStatEntities(utilities._getEntityFromObj(videoStats)));
      }
    }

}

export default connect(mapStateToProps)(ReplyPepoTxBtn);