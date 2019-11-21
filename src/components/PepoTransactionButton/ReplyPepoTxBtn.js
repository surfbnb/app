import { connect } from 'react-redux';
import clone from 'lodash/clone';
import CurrentUser from '../../models/CurrentUser';
import appConfig from '../../constants/AppConfig';
import Store from '../../store';
import { upsertReplyDetailEntities } from '../../actions';
import reduxGetter from '../../services/ReduxGetters';
import Pricer from '../../services/Pricer';
import utilities from '../../services/Utilities';
import { withNavigation } from 'react-navigation';

import Base from "./Base";
import assignIn from "lodash/assignIn";

const mapStateToProps = (state, ownProps) => ({
    balance: state.balance,
    disabled: state.executeTransactionDisabledStatus,
    isEntityUserActivated: utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
    isCurrentUserActivated: CurrentUser.isUserActivated() ,
    supporters: reduxGetter.getReplySupporters(ownProps.entityId),
    isSupporting: reduxGetter.isReplySupported(ownProps.entityId) ,
    totalBt: reduxGetter.getReplyBt(ownProps.entityId),
  });

class ReplyPepoTxBtn extends Base {

    constructor(props){
        super(props);
    }

    getSdkMetaProperties() {
      const metaProperties = clone(appConfig.metaProperties);
      metaProperties['name'] = 'pepo_on_reply';
      metaProperties['details'] = `rdi_${this.props.entityId}`;
      return metaProperties;
    }

    getDropPixel(){
        let specificData = this.props.getPixelDropData(),
            defaultData = {
                e_entity: 'reply',
                e_action: 'contribution',
                e_data_json: {
                    reply_id: this.props.entityId,
                    profile_user_id: this.props.userId,
                    amount: this.btAmount
                }
            };
        return assignIn({}, specificData, defaultData);
    }

    reduxEntityUpdate(  totalBt, supporters ){
      let replyDetails = reduxGetter.getReplyEntity(this.props.entityId),
          updateEntity = false
      ;
      if (totalBt && totalBt > 0) {
        replyDetails['total_amount_raised_in_wei'] = Pricer.getToDecimal(totalBt);
        updateEntity = true;
      }

      if (supporters && !this.props.isSupporting) {
        replyDetails['total_contributed_by'] = supporters;
        updateEntity = true;
      }

      if (updateEntity) {
        Store.dispatch(upsertReplyDetailEntities(utilities._getEntityFromObj(replyDetails)));
      }
    }

}

export default connect(mapStateToProps)( withNavigation(  ReplyPepoTxBtn ));
