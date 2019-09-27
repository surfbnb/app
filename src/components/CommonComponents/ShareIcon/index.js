import React, { PureComponent } from 'react';
import {TouchableOpacity , Image} from "react-native";
import { connect } from 'react-redux';
import reduxGetter from '../../../services/ReduxGetters';
import inlineStyles from './styles';
import multipleClickHandler from "../../../services/MultipleClickHandler";
import ShareVideo from "../../../services/shareVideo";

import share_icon from '../../../assets/social-share-icon.png';
import share_icon_disabled from '../../../assets/social-disabled-share-icon.png';

const mapStateToProps = (state , ownProps) => {
  return {
    isCreatorApproved :  reduxGetter.isCreatorApproved(ownProps.userId)
  }
};

class ShareIcon extends PureComponent {

   constructor(props){
     super(props);
    };

  shareVideo = () => {
    let shareVideo = new ShareVideo(this.props.videoId);
    shareVideo.perform();
  };

  isDisabled = () => {
     return this.props.isCreatorApproved != 1;
  };

  render(){
    return (<TouchableOpacity pointerEvents={'auto'} style={inlineStyles.txElem}
                              disabled={this.isDisabled()}
                              style={{marginBottom: 15, height: 50, width: 50, alignItems: 'center', justifyContent: 'center'}}
                              onPress={multipleClickHandler(() => this.shareVideo())} >
              <Image style={{ height: 35, width: 36.5 }} source={this.isDisabled() ? share_icon_disabled : share_icon} />
          </TouchableOpacity>);
  }

};

export default connect(mapStateToProps)(ShareIcon);
