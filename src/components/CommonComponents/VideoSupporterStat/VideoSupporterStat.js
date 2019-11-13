import { connect } from 'react-redux';

import reduxGetter from '../../../services/ReduxGetters';
import Base from './Base';


const mapStateToProps = (state, ownProps) => {
  return {
    supporters: reduxGetter.getUserSupporters(ownProps.userId, state),
    totalBt: reduxGetter.getVideoBt(ownProps.videoId, state)
  };
};

class VideoAmountStat extends Base {
  constructor(props) {
    super(props);
  }
}



export default connect(mapStateToProps)(Base);
