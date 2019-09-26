import React, { Component } from 'react';
import styles from './styles';
import {Modal, Text, TouchableOpacity, View, Image} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../theme/styles";
import Swipe from '../../assets/swipe.png'
import multipleClickHandler from "../../services/MultipleClickHandler";

export default class CouchMarks extends Component {

    constructor(props) {
      super(props);
    }


    handleGotItClick = () => {
        this.props.navigation.goBack()
    }

    render() {
        return (
            <Modal style={styles.backgroundStyle} transparent={true}>
            <View style={styles.wrappedView}>
                <Text style={styles.headerText}>Quick Tips:</Text>

                <View style={{flexDirection:'row', justifyContent: 'space-between', alignItems: 'center', width: '100%'}}>
                    <Text style={styles.smallText}> Swipe up to watch more videos</Text>
                    <Image source={Swipe} style={{height: 41, width:36, marginRight: 20}}/>
                </View>



                <View style={styles.horizontalLine}></View>

                <Text style={styles.smallText}>
                    Press and hold to show how much you will like it
                </Text>

                <View style={styles.horizontalLine}></View>

                <Text style={styles.smallText}>
                    Tap to create your video
                </Text>

                <LinearGradient
                    colors={['#ff7499', '#ff5566']}
                    locations={[0, 1]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}>
                    <TouchableOpacity
                        onPress={multipleClickHandler(() => this.handleGotItClick())}
                        style={[Theme.Button.btn, { borderWidth: 0 }]}>
                        <Text style={[
                            Theme.Button.btnPinkText,
                            { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center' }
                        ]}>
                            Got It!
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>);


    }
}
