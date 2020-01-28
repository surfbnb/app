
import React, { PureComponent } from 'react';
import { View, Text, Alert} from 'react-native';
import Common from '../../theme/styles/Common';
import Colors from '../../theme/styles/Colors';
import ChannelTagsList from '../ChannelTagsList';

class ChannelsScreen extends PureComponent {

    constructor(props){
        super(props);
    }

    componentDidMount(){

    }

    componentWillUnMount(){
        
    }

    onTagClicked = () => {
        this.setState({         
        })
    }

    render(){
        return (
            <View style={[Common.viewContainer]}>
                <View style={{marginTop: 40}}>
                    <ChannelTagsList onTagClicked = {( item )=> this.onTagClicked( item )} channelId = {'5678'}/>
                </View>
            </View>
        )
    }

}

export default ChannelsScreen;