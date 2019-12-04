import Base from "./Base";
import { withNavigation } from "react-navigation";

class VideoReplyRow extends Base {
    constructor(props) {
      super(props);
    }
}

VideoReplyRow.defaultProps = Base.defaultProps;

export default withNavigation( VideoReplyRow )
