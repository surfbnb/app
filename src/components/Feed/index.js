import { connect } from 'react-redux';

import Feed from './FeedScreen';

const mapStateToProps = ({ feed }) => ({ feed });

export default connect(mapStateToProps)(Feed);
