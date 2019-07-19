import React  from 'react';
import { connect } from "react-redux";
import reduxGetter from "../../services/ReduxGetters";
import {Text} from "react-native";
import timeStamp from "../../helpers/timestampHandling";


const mapStateToProps = (state, ownProps) => {
  return{
    videoId : reduxGetter.getUserCoverVideoId( ownProps.userId, state )
  }
};

function isShowTimeStamp( videoId ){
  let timeStamp = reduxGetter.getVideoUploadUTS(videoId);
  if(timeStamp > ( (Date.now()/1000) + 86400 ) ){
    return true;
  }
  return false;
};

function UpdateTimeStamp( props ) {
  return (
    isShowTimeStamp(props.videoId) && <Text style={{textAlign: 'right'}}>{timeStamp.fromNow( reduxGetter.getVideoTimeStamp(props.videoId) )}</Text>
  )
}

export default connect(mapStateToProps)( UpdateTimeStamp );