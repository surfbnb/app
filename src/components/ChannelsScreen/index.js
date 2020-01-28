
import React, { PureComponent } from 'react';
import { View, FlatList, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import Colors from '../../theme/styles/Colors';
import ChannelTagsList from '../ChannelTagsList';
import ChannelCell from '../ChannelCell';

class ChannelsScreen extends PureComponent {

    static navigationOptions = (options) => {
        const name = options.navigation.getParam('headerTitle');
        return {
          headerBackTitle: null,
          title: name || 'Channel',
          headerTitleStyle: {
            fontFamily: 'AvenirNext-Medium'
          },
          headerStyle: {
            backgroundColor: Colors.white,
            borderBottomWidth: 0,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 1
            },
            shadowOpacity: 0.1,
            shadowRadius: 3
          },
          headerRight: <View><Text>options</Text></View>
        };
      };
    

    constructor(props){
        super(props);
        this.state = {
            list: null
        }
    }

    componentDidMount(){

    }

    componentWillUnMount(){
        
    }

    onTagClicked = () => {
        this.setState({         
        })
    }

    getAboutSection = () => {
        return (
            <View style={{padding: 10}}>
                <Text>About</Text>
                <Text>
                Join the leading minds in the Web3 space for a weekend-long community gathering dedicated to playing with blockchains and #BUIDLing with PegaBufficorns! Event is free f…See More
                </Text>
            </View>
        )
    }

    listHeaderComponent = () => {
        return (
            <View style={{flex: 1, height: 500}}>
                <ChannelCell/>
                {this.getAboutSection()}
                <View style={{padding: 10}}>
                    <ChannelTagsList onTagClicked = {( item )=> this.onTagClicked( item )} channelId = {'120', '122'}/>
                </View>
            </View>
        )
    }

    _keyExtractor = () => {

    }

    _renderItem = () => {
        return (
            <View style={{flex: 1}}></View>
        )
    }

    render(){
        return (
            <View style={[Common.viewContainer]}>
                <FlatList
                    ref={(ref)=> {this.listRef = ref } }
                    ListHeaderComponent={this.listHeaderComponent()}
                    data={this.state.list}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                />
            </View>
        )
    }

}

export default ChannelsScreen;