import BaseVideoReplyRow from "./BaseVideoReplyRow";
import { withNavigation } from "react-navigation";

class NoPendantsVideoReplyRow extends BaseVideoReplyRow {
    constructor(props){
        super(props);
    }

    _renderInvertedFlatList =() => {
        return null;
    }
}

NoPendantsVideoReplyRow.defaultProps = BaseVideoReplyRow.defaultProps;

export default withNavigation( NoPendantsVideoReplyRow );
