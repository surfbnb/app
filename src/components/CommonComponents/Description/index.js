import React from 'react';
import { View, Text, Dimensions} from 'react-native';

import inlineStyles from './styles';
import reduxGetter from '../../../services/ReduxGetters';
import TextFormatter from '../TextFormatter';
import { withNavigation } from 'react-navigation';

const windowWidth = Dimensions.get("window").width;
const charPerLine = windowWidth / 8;
const totalAllowedChars = charPerLine * 3 - 11;

class Description extends React.PureComponent{

    constructor( props ) {
        super( props );
        this.description = reduxGetter.getChannelDescription(props.channelId) 
        || "Join the leading minds in ost.com the Web3 space www.google.com for a #abc weekend-long community gathering dedicated to playing with blockchains and #BUIDLing with PegaBufficorns! Event is free Join the leading minds in the Web3 space for a weekend-long community gathering dedicated to playing with blockchains and #BUIDLing with PegaBufficorns! Event is free"
        this.state = {
          expanded  : false
        }

      this.seeStatus = {
        more  : ' …See More',
        less  : ' …See Less'
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

    getTappedIncludesEntity = ( tag )=> {
      let tappedIncludesEntity = reduxGetter.getChannelIncludesEntity(this.props.channelId, tag);
      return tappedIncludesEntity;
    }

    render(){
      let moreOrLess = this.seeStatus.more;

      if(this.state.expanded){
        moreOrLess = this.seeStatus.less;
      }

        return (
            <View style={inlineStyles.mainWrapper}>
                <Text style={inlineStyles.title}>About</Text>
                <Text style={[inlineStyles.desc]}>
                <TextFormatter text={this.getText()} getTappedIncludesEntity={this.getTappedIncludesEntity} 
                        navigation={this.props.navigation}/>
                  <Text onPress={this.showMore} style={inlineStyles.more}>{moreOrLess}</Text>
                </Text>
            </View>
        )
    }
    
}

export default withNavigation(Description);