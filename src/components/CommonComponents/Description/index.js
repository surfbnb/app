import React from 'react';
import { View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';

import inlineStyles from './styles';
import reduxGetter from '../../../services/ReduxGetters';
import TextFormatter from '../TextFormatter';
import { withNavigation } from 'react-navigation';

const windowWidth = Dimensions.get("window").width;
const charPerLine = windowWidth / 8;
const totalAllowedChars = charPerLine * 3 - 11;

const mapStateToProps = (state, ownProps) => {
  return {
    description: reduxGetter.getChannelDescription(ownProps.channelId) || ''
  };
};

class Description extends React.PureComponent{

    constructor( props ) {
        super( props );
        this.state = {
          expanded  : false
        }

      this.seeStatus = {
        more  : '…  See More',
        less  : '   See Less'
      }
    }

    showMore = () => {
        this.setState({
            expanded : !this.state.expanded
        })
    }

    getText(){
      return this.isTextOverflow() && !this.state.expanded ?
                     this.props.description.substring(0, totalAllowedChars) :
                     this.props.description;
    }

    isTextOverflow = () => {
      return this.props.description && this.props.description.length > totalAllowedChars;
    }

    getTappedIncludesEntity = (text) => {
      let tappedIncludesEntity = reduxGetter.getChannelIncludesEntity(this.props.channelId, text);
      return tappedIncludesEntity;
    }

    render(){
      let moreOrLess = this.seeStatus.more;

      if(this.state.expanded){
        moreOrLess = this.seeStatus.less;
      }

        return (
          (this.props.description ? <View style={inlineStyles.mainWrapper}>
            <Text style={inlineStyles.title}>About</Text>
            <Text style={[inlineStyles.desc]}>
              <TextFormatter text={this.getText()} getTappedIncludesEntity={this.getTappedIncludesEntity}
                             navigation={this.props.navigation}/>
              {this.isTextOverflow() || this.state.expanded ? <Text onPress={this.showMore} style={inlineStyles.more}>{moreOrLess}</Text> :
                <React.Fragment/> }
            </Text>
          </View> : null )
        )
    }
    
}

export default connect(mapStateToProps)(withNavigation(Description));