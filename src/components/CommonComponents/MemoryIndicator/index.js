import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';

import Vitals from 'react-native-vitals';
import inlineStyles from './styles';
import multipleClickHandler from '../../../services/MultipleClickHandler';
import { IS_STAGING } from '../../../constants';

export default class MemoryIndicator extends React.Component {
    constructor( props ){
        super( props );
        this.state = {
            memoryLow: false
        }
    }

  componentDidMount(){
    if(IS_STAGING) {
      this.vitalsListener = Vitals.addLowMemoryListener(memory => {
        console.log("low memory")
        this.setState({
            memoryLow: true
        })
     })
    };
  }

  componentWillUnmount(){
    if(IS_STAGING) {
      this.vitalsListener && this.vitalsListener.remove();
    }
  }

   showMemoryStats = () => {
    Vitals.getMemory().then(memory => {
      var {
        appUsed,
        systemTotal,
        systemFree,
        systemUsed
      } = memory;
      Alert.alert("","Memory used- "+"appUsed: "+appUsed+
      " systemTotal: "+systemTotal+
      " systemFree: "+systemFree+
      " systemUsed: "+systemUsed);
      })
  }

  randomHex = () => {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

    render() {
        return IS_STAGING && (<TouchableOpacity pointerEvents={'auto'} 
                                  style={[inlineStyles.wrapper,{ backgroundColor: this.state.memoryLow ? this.randomHex(): "transparent"}]}
                                  onPress={multipleClickHandler(() => this.showMemoryStats())} >
        </TouchableOpacity>)
    }
}