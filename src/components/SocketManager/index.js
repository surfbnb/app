import React, { Component } from 'react';
import PepoSocket from '../../services/PepoSocket';
import { connect } from 'react-redux';
import { YellowBox } from 'react-native';

YellowBox.ignoreWarnings(['Unrecognized WebSocket connection']);

class SocketManager extends Component {
  constructor(props) {
    super(props);
    this.pepoSocket = null;
  }

  initSocket() {
    if (!this.pepoSocket) {
      this.pepoSocket = new PepoSocket(this.props.current_user.id);
      this.pepoSocket.connect();
    }
  }

  componentWillUnmount() {
    this.pepoSocket && this.pepoSocket.disconnect();
  }

  render() {
    if (this.props.current_user.id) {
      this.initSocket();
    } else {
      this.pepoSocket && this.pepoSocket.disconnect();
    }
    return null;
  }
}

const mapStateToProps = ({ current_user }) => ({ current_user });

export default connect(mapStateToProps)(SocketManager);
