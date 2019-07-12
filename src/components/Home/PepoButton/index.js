import * as React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import ClapBubble from "./ClapBubble";
import pepo_tx_img from "../../../assets/pepo_anim_btn.png"
import inlineStyles from '../styles'
import Colors from "../../../theme/styles/Colors"
import ClapButton from "./ClapButton";

const animDuration = 500
export default class Index extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      count: 0,
      claps: [],
      isClapping: false,
      scaleValue : new Animated.Value(0)
    };
  }

  componentDidMount(){
    Animated.timing(this.state.scaleValue, {
      toValue : 1,
      duration: animDuration,
      useNativeDriver: true
    }).start()
  }

  keepClapping = () => {
    console.log('keepClapping');
    this.setState({ isClapping: true });
    this.clap();
    this.keepclap = setInterval(() => this.clap(), animDuration);
  }

  stopClapping = () => {
    console.log('stopClapping');
    this.setState({ isClapping: false });
    if (this.keepclap) {
      clearInterval(this.keepclap);
    }
    this.props.excequteTransaction && this.props.excequteTransaction( ) ; 
  }

  animationComplete(countNum) {
    let claps = this.state.claps;
    claps.splice(claps.indexOf(countNum), 1);
    this.setState({ claps });
  }
  clap() {
    let count = this.state.count;
    let claps = this.state.claps;
    count++;
    claps.push(count);
    this.setState({ count });
  }
  renderClaps() {
    return this.state.claps.map(countNum => (
      <ClapBubble
        key={countNum}
        count={countNum}
        animationComplete={this.animationComplete.bind(this)}
      />
    ));
  }
  render() {
    return (
      <View>
        {this.renderClaps()}
        <View style={inlineStyles.pepoElemBtn}>
          <TouchableWithoutFeedback
            onPressIn={this.keepClapping}
            onPressOut={this.stopClapping}>
            <View>
              <ClapButton isClapping={this.state.isClapping}/>
            </View>
          </TouchableWithoutFeedback>
          <Text style={inlineStyles.pepoTxCount}>{this.props.totalBt || 0}</Text>
        </View>
      </View>
    );
  }
}
