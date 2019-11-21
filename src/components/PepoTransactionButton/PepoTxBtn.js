import { connect } from 'react-redux';
import clone from 'lodash/clone';
import assignIn from 'lodash/assignIn';

import CurrentUser from '../../models/CurrentUser';
import appConfig from '../../constants/AppConfig';
import Store from '../../store';
import { upsertVideoStatEntities } from '../../actions';
import reduxGetter from '../../services/ReduxGetters';
import Pricer from '../../services/Pricer';
import utilities from '../../services/Utilities';
import { withNavigation } from 'react-navigation';

import Base from "./Base";

const mapStateToProps = (state, ownProps) => ({
    balance: state.balance,
    disabled: state.executeTransactionDisabledStatus,
    isEntityUserActivated: utilities.isUserActivated(reduxGetter.getUserActivationStatus(ownProps.userId)),
    supporters: reduxGetter.getVideoSupporters(ownProps.entityId),
    isSupporting: reduxGetter.isVideoSupported(ownProps.entityId),
    totalBt: reduxGetter.getVideoBt(ownProps.entityId, state),
    isCurrentUserActivated: CurrentUser.isUserActivated()
  });

class PepoTxBtn extends Base {

  constructor(props){
    super(props);
  }

  getSdkMetaProperties() {
    const metaProperties = clone(appConfig.metaProperties);
    metaProperties['name'] = 'video';
    metaProperties['details'] = `vi_${this.props.entityId}`;
    return metaProperties;
  }

  getDropPixel(){
    let specificData = this.props.getPixelDropData(),
        defaultData = {
          e_entity: 'video',
          e_action: 'contribution',
          e_data_json: {
            video_id: this.props.entityId,
            profile_user_id: this.props.userId,
            amount: this.btAmount
          }
        };
    return assignIn({}, specificData, defaultData);
  }

  reduxEntityUpdate(  totalBt, supporters ){
    let videoStats = reduxGetter.getVideoStats(this.props.entityId),
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

export default  connect(mapStateToProps)(withNavigation(PepoTxBtn));
