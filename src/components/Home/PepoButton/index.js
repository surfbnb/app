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
import ClapButton from "./ClapButton";

const animDuration = 1000;

class PepoButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      count: this.props.count,
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
    this.setState({ isClapping: true });
    this.clap();
    this.keepclap = setInterval(() => this.clap(), animDuration);
  }

  stopClapping = () => {
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
        animDuration={animDuration}
        animationComplete={this.animationComplete.bind(this)
        }
      />
    ));
  }
  render() {
    return (
      <View>
        {this.renderClaps()}
        <View style={inlineStyles.pepoElemBtn}>
          <TouchableWithoutFeedback
            disabled={this.props.disabled}
            onPressIn={this.keepClapping}
            onPressOut={this.stopClapping}>
            <View>
              <ClapButton animDuration={animDuration} isClapping={this.state.isClapping}/>
            </View>
          </TouchableWithoutFeedback>
          <Text style={inlineStyles.pepoTxCount}>{this.props.totalBt || 0}</Text>
        </View>
      </View>
    );
  }
}

PepoButton.defaultProps = {
  disabled: false,
  count: 0
};

export default PepoButton;
