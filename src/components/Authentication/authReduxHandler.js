import { connect } from 'react-redux';

import Authentication from './index';
import { setLoggedIn } from '../../actions';

const mapStateToProps = ({ isLoggedIn }) => ({ isLoggedIn });
const mapDispatchToProps = (dispatch) => {
  return {
    dispatchLoggedIn: (data) => {
      dispatch(setLoggedIn(data));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Authentication);
