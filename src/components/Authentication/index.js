import { connect } from 'react-redux';

import AuthScreen from './AuthScreen';

const mapStateToProps = ({ isLoggedIn }) => ({ isLoggedIn });

export default connect(mapStateToProps)(AuthScreen);
