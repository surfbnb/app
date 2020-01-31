import React, { PureComponent } from 'react';
import {TouchableOpacity , Image} from "react-native";
import multipleClickHandler from "../../../services/MultipleClickHandler";
import ShareVideo from "../../../services/shareVideo";
import {testProps} from '../../../constants/AppiumAutomation';

import share_icon from '../../../assets/social-share-icon.png';
import share_icon_disabled from '../../../assets/social-disabled-share-icon.png';


class Base extends PureComponent {

   constructor(props){
     super(props);
    };

  shareVideo = () => {
    let shareVideo = new ShareVideo(this.props.url);
    shareVideo.perform();
  };

  render(){
    return (<TouchableOpacity pointerEvents={'auto'}
                              disabled={!this.props.canReply}
                              style={{marginBottom: 0, height: 50, width: 50, alignItems: 'center', justifyContent: 'center'}}
                              onPress={multipleClickHandler(() => this.shareVideo())}
                              {...testProps('pepo-share-button')}
            >
              <Image style={{ height: 35, width: 36.5 }} source={!this.props.canReply ? share_icon_disabled : share_icon} />
          </TouchableOpacity>);
  }

};


export default Base;
