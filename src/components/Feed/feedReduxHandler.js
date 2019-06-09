import { connect } from 'react-redux';

import Feed from './index';
import { upsertAction } from '../../actions';

const mapStateToProps = ({ feed }) => ({ feed });
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchUpsert: (data) => {
      dispatch(upsertAction(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);
