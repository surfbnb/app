import { connect } from 'react-redux';

import Feed from './FeedScreen';

const mapStateToProps = ({ feed_entities, public_feed_list }) => ({ feed_entities, public_feed_list });

export default connect(mapStateToProps)(Feed);
