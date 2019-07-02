import React, { Component } from 'react';
import { View, FlatList, Text, Dimensions, StyleSheet, StatusBar , ScrollView} from 'react-native';



const colorData = [
    'rgb(255,140,140)',
    'rgb(253,244,128)',
    'rgb(5,217,200)',
    'rgb(59,188,255)',
    'rgb(242,212,121)',
    'rgb(164,251,158)',
    'rgb(251,162,255)',
    'rgb(55,108,180)',
    'rgb(141,121,242)',
    'rgb(255,140,140)',
    'rgb(253,244,128)'
]

export default class Videos extends Component {

    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
            header: null
        };
     };

    constructor(){
        super();
        this.index = 0 ;
        this.flatListRef = null;
        this.scrolling = false ; 
        this.offset = 0;
    }

    render() {
        return (
            <View  >
                <StatusBar translucent={true} backgroundColor={'transparent'} />
                    <FlatList

                        // decelerationRate={"fast"}
                        // snapToAlignment={"center"}
                        // snapToInterval={Dimensions.get('screen').height}

                        pagingEnabled={true}
                      
                        ref={(ref) => { this.flatListRef = ref }}
                        data={colorData}
                        keyExtractor={(item, index) => `id_${index}`}
                        style={styles.fullScreen}
                        renderItem={({ item }) => <View style={[{...styles.fullHeight}, {backgroundColor: item}]}  />}
                    />
             </View>
        )
    }
}

let styles = StyleSheet.create({
    fullScreen: {
        width: Dimensions.get('screen').width,
        height: Dimensions.get('screen').height,
    },
    fullHeight: {
        width: '100%',
        height: Dimensions.get('screen').height
    }
});
