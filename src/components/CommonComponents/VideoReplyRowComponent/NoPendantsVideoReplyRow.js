import Base from "./Base";
import { withNavigation } from "react-navigation";

class NoPendantsVideoReplyRow extends Base {
    constructor(props){
        super(props);
    }

    _renderInvertedFlatList =() => {
        return null;
    }
}

NoPendantsVideoReplyRow.defaultProps = Base.defaultProps;

export default withNavigation( NoPendantsVideoReplyRow );
