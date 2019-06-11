import { connect } from 'react-redux';

import Users from './UsersScreen';
import { upsertUsers } from '../../actions';

const mapStateToProps = ({ users }) => ({ users });
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchUpsert: (data) => {
      dispatch(upsertUsers(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
