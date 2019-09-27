import React, { Component } from 'react';
import PepoSocket from '../services/PepoSocket';
import { connect } from 'react-redux';
import CurrentUser from "../models/CurrentUser";

class SocketManager extends Component {
  constructor(props) {
    super(props);
    this.pepoSocket = null;
  }

  initSocket() {
    if (!this.pepoSocket) {
      this.pepoSocket = new PepoSocket(this.props.currentUserId);
      this.pepoSocket.connect();
    }
  }

  componentWillUnmount() {
    this.pepoSocket && this.pepoSocket.disconnect();
  }

  render() {
    if (this.props.currentUserId) {
      this.initSocket();
    } else {
      if(this.pepoSocket){
        this.pepoSocket.disconnect();
        this.pepoSocket = null;
      }
    }
    return null;
  }
}

const mapStateToProps = () => {
  return {
    currentUserId: CurrentUser.getUserId()
  }
};

export default connect(mapStateToProps)(SocketManager);
