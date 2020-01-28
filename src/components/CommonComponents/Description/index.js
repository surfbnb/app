import React from 'react';
import { View, Text, Dimensions} from 'react-native';

import inlineStyles from './styles';
import reduxGetter from '../../../services/ReduxGetters';

const windowWidth = Dimensions.get("window").width;
const charPerLine = windowWidth / 8;
const totalAllowedChars = charPerLine * 3 - 11;

class Description extends React.PureComponent{

    constructor( props ) {
        super( props );
        this.description = reduxGetter.getChannelDescription(props.channelId) 
        || "Join the leading minds in the Web3 space for a weekend-long community gathering dedicated to playing with blockchains and #BUIDLing with PegaBufficorns! Event is free f"
        this.state = {
            expanded  : false
        }
    }

    showMore = () => {
        this.setState({
            expanded : !this.state.expanded
        })
    }

    getText(){
        return this.description.length > totalAllowedChars && !this.state.expanded ?
                     this.description.substring(0, totalAllowedChars) :
                     this.description;
    }

    render(){
        return (
            <View style={inlineStyles.mainWrapper}>
                <Text style={inlineStyles.title}>About</Text>
                    <Text style={inlineStyles.desc}>
                        {this.getText()} 
                        {!this.state.expanded ? <Text onPress={this.showMore} style={inlineStyles.more}> …See More</Text> : <React.Fragment/>}
                    </Text>
            </View>
        )
    }
    
}

export default Description;