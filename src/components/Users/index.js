import { connect } from 'react-redux';

import Users from './UsersScreen';

const mapStateToProps = ({ user_entities, user_list }) => ({ user_entities, user_list });

export default connect(mapStateToProps)(Users);
