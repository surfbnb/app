import { connect } from 'react-redux';
import currenUserModel from "../../models/CurrentUser";

import ProfileScreen from './ProfileScreen';

const mapStateToProps = ({ user_feed_list }) => ({ user_feed : user_feed_list[currenUserModel.getUserId()] });

export default connect(mapStateToProps)(ProfileScreen);
