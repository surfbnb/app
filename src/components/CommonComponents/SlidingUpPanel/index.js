import SlidingUpPanel from "rn-sliding-up-panel";

class Panel extends SlidingUpPanel{

  constructor(props) {
    super(props);
  }

  _onBackButtonPress() {
    return false;
  }

}

export default Panel ;
