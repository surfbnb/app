import { connect } from 'react-redux';

import reduxGetter from '../../../services/ReduxGetters';
import Base from './Base';


const mapStateToProps = (state, ownProps) => {
  return {
    supporters: reduxGetter.getUserSupporters(ownProps.userId, state),
    totalBt: reduxGetter.getReplyBt(ownProps.videoId, state)
  };
};

class VideoReplyAmountStat extends Base {
  constructor(props) {
    super(props);
  }
}

export default connect(mapStateToProps)(Base);
