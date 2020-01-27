
import React, { PureComponent } from 'react';
import { View, Text} from 'react-native';
import Common from '../../theme/styles/Common';
import HFlatlist from '../CommonComponents/HFlatlist';

class ChannelsScreen extends PureComponent {

    constructor(props){
        super(props);
        this.state ={

        }
    }

    componentDidMount(){

    }

    componentWillMount(){
        
    }

    render(){
        return (
            <View style={[Common.viewContainer]}>
                <View style={{marginTop: 40}}>
                    <HFlatlist
                        customStyles={{height: 50, padding: 5, justifyContent: 'center', alignItems: 'center'}}
                        itemComponent = {ItemComponent}  
                        payloadList = {["#hbvfhjeg", '#gvfhbfh', '#vfhbvfh',"#hbvfhjeg", '#gvfhbfh', '#vfhbvfh',"#hbvfhjeg", '#gvfhbfh', '#vfhbvfh']}
                    />
                </View>
            </View>
        )
    }

}

const ItemComponent = (props)=> {
    return (
        <View style={{height: 30, padding: 5, fontSize: 12}}><Text>{props.item}</Text></View>
    )
}

export default ChannelsScreen;