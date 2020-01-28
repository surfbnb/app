import React from 'react';
import { View, Text} from 'react-native';

import inlineStyles from './styles';

const Description = ( props ) => {
    return (
        <View style={inlineStyles.mainWrapper}>
            <Text>About</Text>
            <Text>
                Join the leading minds in the Web3 space for a weekend-long community gathering dedicated to playing with blockchains and #BUIDLing with PegaBufficorns! Event is free f…See More
            </Text>
        </View>
    )
}

export default Description;