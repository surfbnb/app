import React , {PureComponent} from "react";
import ReplyList from "../CommonComponents/ReplyList";

class FullScreenReplyCollection extends PureComponent{

    static navigationOptions = (props) => {
        return {
            headerBackTitle: null,
            header: null,
            gesturesEnabled: false
        };
    };

    constructor(props){
        super(props);
    }

    getCurrentIndex = () => {
        return this.props.navigation.getParam("currentIndex") ;
    }

    getFetchServices = () => {
        return  this.props.navigation.getParam("fetchServices")
    }

    getBaseUrl(){
        return this.props.navigation.getParam("baseUrl");
    }

    getParentClickHandler(){
        return this.props.navigation.getParam("parentClickHandler");
    }

    getReplyType(){
      return this.props.navigation.getParam("isUserReplyVideo");
    }

    render() {
        return (
            <ReplyList currentIndex={this.getCurrentIndex()} 
                  fetchServices={this.getFetchServices()}
                  baseUrl={this.getBaseUrl()}
                  parentClickHandler={this.getParentClickHandler()}
                  isUserReplyVideo ={this.getReplyType()}
              />
        );
    }

}

export default FullScreenReplyCollection ;
