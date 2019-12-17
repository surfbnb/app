import React , {PureComponent} from "react";
import {Text} from "react-native";
import {connect} from "react-redux";
import ReduxGetters from '../../../services/ReduxGetters';
import Pricer from "../../../services/Pricer";
import styles from './styles';

const mapStateToPropsVideo = (state, ownProps) => {
  return {
    amount: ReduxGetters.getVideoBt(ownProps.entityId)
  }
};


const mapStateToPropsReply = (state, ownProps) => {
  return {
    amount:  ReduxGetters.getReplyBt(ownProps.entityId)
  }
};

class Amount extends PureComponent {

  constructor(props){
    super(props);
  }

  render() {
    let amount = Pricer.getFromDecimal(this.props.amount) || 0;
    return <Text style={[ styles.videoStatsTxt, this.props.style]} numberOfLines={1} >
      {amount}
    </Text>
  }
}

const VideoPepoAmount =  connect(mapStateToPropsVideo)(Amount);
const ReplyPepoAmount =  connect(mapStateToPropsReply)(Amount);

export {VideoPepoAmount, ReplyPepoAmount};

