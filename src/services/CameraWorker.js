import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import Store from '../store';
import { upsertRecordedVideo } from '../actions';
import CameraManager from '../services/CameraManager';
import utilities from './Utilities';
import appConfig from '../constants/AppConfig';
import AsyncStorage from "@react-native-community/async-storage";

const recordedVideoStates = [
    'raw_video',
    'compressed_video',
    's3_video',
    'cover_image',
    's3_cover_image'
];

const recordedVideoActions = [
    'do_upload',
    'do_discard'
];

class CameraWorker extends PureComponent {
    constructor() {
        super();
    }

    syncAsyncToRedux(){

        // Early exit
        if(Object.keys(this.props.current_user).length === 0){
            console.log('syncAsyncToRedux :: Cannot sync as current_user is not yet available');
            return;
        }
        if(Object.keys(this.props.recorded_video).length > 0){
            console.log('syncAsyncToRedux :: No sync needed as recorded_video has data');
            return;
        }

        // Need to sync
        if(this._getCurrentUserRecordedVideoKey()){
            utilities
                .getItem(this._getCurrentUserRecordedVideoKey())
                .then((data) => {
                    upsertRecordedVideo(JSON.stringify(data));
                    this.ReduxSyncedByWorker = true;
                    console.log('syncAsyncToRedux :: Data synced from Async to recorded_video');
                });
        }

    }

    syncReduxToAsync(){

        // Early exit
        if(this.ReduxSyncedByWorker){
            console.log('syncReduxToAsync :: No sync needed as Redux was synced by worker');
            this.ReduxSyncedByWorker = false;
            return;
        }

        // Need to sync
        if(this._getCurrentUserRecordedVideoKey()){
            let dataToSave = recordedVideoStates.map(value => {
                return this.props.current_user[value];
            });
            utilities
                .saveItem(this._getCurrentUserRecordedVideoKey(), dataToSave)
                .then(() => {
                    console.log('syncReduxToAsync :: Data synced from recorded_video to Async');
                });
        }
    }

    processVideo(){

        // Early exit
        if(Object.keys(this.props.current_user).length === 0 || Object.keys(this.props.recorded_video).length === 0){
            console.log('processVideo :: Nothing to process');
            return;
        }

        // Clean-up check
        if(this.props.recorded_video.do_discard){
            console.log('processVideo :: Discarding video... Cleaning up Async, Redux, Stop Compression and remove files from cache');
            this.cleanUp();
            return;
        }

        // No upload consent, so only compress
        if(!this.props.recorded_video.do_upload){
            console.log('processVideo :: No upload consent. Compressing to save time...');
            this.compressVideo();
            return;
        }

        if(this.props.recorded_video.do_upload){
            console.log('processVideo :: Got upload consent. Uploading video and cover image to s3 and attempting post Video with Cover Image...');
            this.uploadVideo();
            this.uploadCoverImage();
            this.postVideoWithCoverImage();
        }

    }

    cleanUp(){

    }

    compressVideo(){

    }

    uploadVideo(){

    }

    uploadCoverImage(){

    }

    postVideoWithCoverImage(){

    }

    _getCurrentUserRecordedVideoKey(){
        if(this.props.current_user.id){
            return `user-${this._getCurrentUserId()}-recorded_video`;
        }
        return;
    }

    render() {
        this.syncAsyncToRedux();
        this.syncReduxToAsync();
        this.processVideo();
        return (<React.Fragment/>);
    }
}

const mapStateToProps = ({ recorded_video, current_user }) => ({ recorded_video, current_user });

export default connect(mapStateToProps)(CameraWorker);
