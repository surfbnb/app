import { connect } from 'react-redux';

import Feed from './FeedScreen';

const mapStateToProps = ({ public_feed_list }) => ({ public_feed_list });

export default connect(mapStateToProps)(Feed);
