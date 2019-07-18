import React, { PureComponent } from 'react';
import {View, Text} from 'react-native';
import BackArrow from "../CommonComponents/BackArrow";

import { withNavigation } from 'react-navigation';


class BioScreen extends PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
          title: "Bio",
          headerBackImage: (<BackArrow/>)
        };
      };

    constructor(props){
        super(props);
    }


    render() {
        return (
          <Text>"HEllo in bio"</Text>
        )
    }
}

export default withNavigation( BioScreen );