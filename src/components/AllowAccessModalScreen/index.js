import React, { Component } from 'react';
import AllowAccessModal from '../Profile/AllowAccessModal';
import CameraIcon from '../../assets/camera_icon.png';
import EventEmitter from 'eventemitter3';

export const allowAcessModalEventEmitter = new EventEmitter();

class AllowAccessModalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { showCameraAccessModal: false, accessText: '' };
  }

  componentDidMount = () => {
    allowAcessModalEventEmitter.on('show', (accessText) => {
      this.setState({ showCameraAccessModal: true, accessText });
    });
  };

  componentWillUnmount = () => {
    allowAcessModalEventEmitter.removeListener('show');
  };

  render() {
    return (
      <AllowAccessModal
        onClose={() => {
          this.setState({
            showCameraAccessModal: false
          });
        }}
        modalVisibility={this.state.showCameraAccessModal}
        headerText="Camera"
        accessText={this.state.accessText}
        accessTextDesc="Allow access to your camera and microphone to take video "
        imageSrc={CameraIcon}
      />
    );
  }
}

//make this component available to the app
export default AllowAccessModalScreen;
