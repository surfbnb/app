import { connect } from 'react-redux';

import Feed from './FeedScreen';
import { upsertPosts } from '../../actions';

const mapStateToProps = ({ feed }) => ({ feed });
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchUpsert: (data) => {
      dispatch(upsertPosts(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);
