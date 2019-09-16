import React, { PureComponent } from 'react';
import Utilities from './Utilities';
import AppConfig from '../constants/AppConfig';

export default class InviteCodeWorker extends PureComponent {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let inviteCode = '';
    Utilities.saveItem(AppConfig.appInstallInviteCodeASKey, inviteCode);
  }

  render() {
    return <React.Fragment />;
  }
}
