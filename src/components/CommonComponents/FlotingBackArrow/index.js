import React, { PureComponent } from 'react';
import {Image,TouchableOpacity} from 'react-native';

import historyBack from  "../../../assets/user-video-history-back-icon.png";
import inlineStyles from './styles'
import { withNavigation } from 'react-navigation';

class FloatingBackArrow extends PureComponent {

    constructor(props){
        super(props);
    }

    render(){
        return  (
                <TouchableOpacity onPressOut={()=>this.props.navigation.goBack(null)} style={inlineStyles.historyBackSkipFont}>
                    <Image style={{ width: 14.5, height: 22 }} source={historyBack} />
                </TouchableOpacity>
                )
    }

}

export default withNavigation( FloatingBackArrow );