import Base from "./Base";
import { withNavigation } from "react-navigation";
import ReplyHelper from "../../../helpers/ReplyHelper";

class NoPendantsVideoReplyRow extends Base {
    constructor(props){
        super(props);
    }

    _renderInvertedFlatList =() => {
        return null;
    }

    onPixelFired = ()=> {
        ReplyHelper.updateEntitySeen( this.props.replyDetailId );
    }
}

NoPendantsVideoReplyRow.defaultProps = Base.defaultProps;

export default withNavigation( NoPendantsVideoReplyRow );
