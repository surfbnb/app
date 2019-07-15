import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import CameraManager from '../services/CameraManager';
import appConfig from '../constants/AppConfig';

class CameraWorker extends PureComponent {
    constructor() {
        super();
        this.sync();
    }

    sync(){

    }

    processVideo(){

    };

    render() {
        this.processVideo();
        return (<React.Fragment/>);
    }
}

const mapStateToProps = ({ recorded_video }) => ({ recorded_video });

export default connect(mapStateToProps)(CameraWorker);
