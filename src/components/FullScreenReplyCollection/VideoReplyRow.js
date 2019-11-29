

import BaseVideoReplyRow from "./BaseVideoReplyRow";
import { withNavigation } from "react-navigation";

class VideoReplyRow extends BaseVideoReplyRow {
    constructor(props) {
      super(props);
    }
}

VideoReplyRow.defaultProps = BaseVideoReplyRow.defaultProps;

export default withNavigation( VideoReplyRow )
