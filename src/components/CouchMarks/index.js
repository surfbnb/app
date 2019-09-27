import React, { Component } from 'react';
import styles from './styles';
import {Text, TouchableOpacity, View, Image} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Theme from "../../theme/styles";
import Swipe from '../../assets/swipe.png';
import PepoIcon from '../../assets/pepo_coach.png';
import AddIcon from '../../assets/add_icon_coach.png';
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
            <View style={styles.backgroundStyle} transparent={true}>
                <View style={styles.wrappedView}>
                    <Text style={styles.headerText}>Quick Tips:</Text>

                    <View style={{flexDirection:'row', alignItems: 'center', width: '100%'}}>
                        <Text style={[styles.smallText, {flexWrap: 'wrap', flex: 1}]}>Swipe up to watch more videos</Text>
                        <Image source={Swipe} style={{height: 41, width:36, marginHorizontal: 10}}/>
                    </View>

                    <View style={styles.horizontalLine}></View>

                    <View style={{flexDirection:'row', alignItems: 'center', width: '100%'}}>
                        <View style={{flexDirection:'row', flex: 1, flexWrap: 'wrap', alignItems: 'center'}}>
                            <Text>
                              <Text style={styles.smallText }>Press and hold</Text>{' '}
                              <Image source={PepoIcon} style={{height: 14, width:14}}/>{' '}
                              <Text style={styles.smallText }>to show how much you will like it</Text>
                            </Text>
                        </View>
                        <Image source={PepoIcon} style={{height: 41, width:41, marginHorizontal: 10}}/>
                    </View>

                    <View style={styles.horizontalLine}></View>

                    <View style={{flexDirection:'row', alignItems: 'center', width: '100%'}}>
                        <View style={{flexDirection:'row', flex: 1, flexWrap: 'wrap', alignItems: 'center'}}>
                            <Text style={styles.smallText }>Tap</Text>
                            <Image source={AddIcon} style={{height: 14, width:14, marginHorizontal: 5}}/>
                            <Text style={styles.smallText }>to create your video</Text>
                        </View>
                        <Image source={AddIcon} style={{height: 40, width:40, marginHorizontal: 10}}/>
                    </View>

                    <LinearGradient
                        colors={['#ff7499', '#ff5566']}
                        locations={[0, 1]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ alignSelf: 'center', paddingHorizontal: 15, marginTop: 30, borderRadius: 3 }}>
                        <TouchableOpacity
                            onPress={multipleClickHandler(() => this.handleGotItClick())}
                            style={[Theme.Button.btn, { borderWidth: 0, minWidth: '100%' }]}>
                            <Text style={[
                                Theme.Button.btnPinkText,
                                { fontSize: 16, fontFamily: 'AvenirNext-DemiBold', textAlign: 'center'}
                            ]}>
                                Got It!
                            </Text>
                        </TouchableOpacity>
                    </LinearGradient>

                </View>
            </View>);


    }
}
