import React, { Component } from 'react';
import PepoSocket from '../../services/PepoSocket';
import {connect} from "react-redux";

class SocketManager extends Component {
  constructor(props) {
    super(props);
  }

  initSocket(){
    if(!this.pepoSocket){
      this.pepoSocket = new PepoSocket(this.props.current_user.id);
      this.pepoSocket.connect();
    }
  }

  render() {
    if(this.props.current_user.id){
      this.initSocket();
    }
    return null;
  }
}

const mapStateToProps = ({ current_user }) => ({ current_user });

export default connect(mapStateToProps)(SocketManager);
