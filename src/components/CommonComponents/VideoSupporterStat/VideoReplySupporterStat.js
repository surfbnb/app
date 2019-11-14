import { connect } from 'react-redux';

import reduxGetter from '../../../services/ReduxGetters';
import Base from './Base';
import { withNavigation } from 'react-navigation';


const mapStateToProps = (state, ownProps) => {
  return {
    supporters: reduxGetter.getUserSupporters(ownProps.userId, state),
    totalBt: reduxGetter.getReplyBt(ownProps.entityId, state)
  };
};


export default connect(mapStateToProps)( withNavigation( Base ));
