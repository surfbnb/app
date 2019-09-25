import * as React from "react";
import {
  Text,
  View,
  Animated,
  TouchableWithoutFeedback
} from "react-native";
import ClapBubble from "./ClapBubble";
import inlineStyles from '../styles'
import ClapButton from "./ClapButton";
import appConfig from "../../../constants/AppConfig";
import Pricer from "../../../services/Pricer";

const animDuration = 1000;
const maxThreshold = appConfig.maxBtAllowedInSingleTransfer;

class PepoButton extends React.Component {
  constructor(props) {
    super(props);
    this.currentClapCount = 0;
    this.state = {
      count: this.props.count,
      disabled: this.props.disabled,
      claps: {},
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

  componentWillReceiveProps( nextProps ){
    let newState;
    if( nextProps.count != this.state.count ){
      newState = newState || {};
      newState.count = nextProps.count;
    }

    if ( nextProps.disabled != this.state.disabled ) {
      newState = newState || {};
      newState.disabled = nextProps.disabled;
    }
    
    newState && this.setState(newState);
  }

  keepClapping = () => {
    this.setState({ isClapping: true});
    this.clap();
    this.keepclap = setInterval(() => {
      this.clap();
    }, animDuration);
  }

  stopClapping = () => {
    if (this.keepclap) {
      clearInterval(this.keepclap);
    }
    this.setState({ isClapping: false ,  disabled : true }, () => {
      this.props.onPressOut && this.props.onPressOut( this.currentClapCount, this.state.count ) ;
      this.currentClapCount = 0;  
    });
  }

  animationComplete(countNum) {
    let claps = this.state.claps;
    delete claps[ countNum ];
    this.setState({ claps: claps });
  }

  clap() {
    if(this.currentClapCount >= this.getMaxThreshold() ){
      this.props.onMaxReached && this.props.onMaxReached( this.currentClapCount ); 
      this.state.isClapping =  false;
      return; 
    }
    let count = this.state.count;
    let claps = this.state.claps;
    count++;
    this.currentClapCount++;
    claps[ count ] = true;
    this.setState({ count });
  }
  renderClaps() {
    let claps = Object.keys( this.state.claps ); 
    return claps.map(countNum => {
      let _id =   this.props.id + "_" +countNum;   
      return (
      <ClapBubble
        key={_id}
        count={countNum}
        animDuration={animDuration}
        animationComplete={this.animationComplete.bind(this)
        }
      />);
    });
  }

  getMaxThreshold(){
    if( this.props.maxCount && this.props.maxCount > maxThreshold ){
      return maxThreshold ; 
    }else{
      return this.props.maxCount ;  
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.renderClaps()}
        <Text style={inlineStyles.pepoTxCount}>{ Pricer.displayAmountWithKFomatter(this.state.count || 0 )}</Text>
        <TouchableWithoutFeedback
          disabled={this.state.disabled}
          onPressIn={this.keepClapping}
          onPressOut={this.stopClapping}>
          <View style={{marginBottom: 15}}>
            <ClapButton disabled={this.state.disabled}
                        isSupported={this.props.isSupported}
                        id={this.props.id+"_clap_btn"}
                        animDuration={animDuration}
                        isClapping={this.state.isClapping}
                        isSelected={this.props.isSelected}
            />
          </View>
        </TouchableWithoutFeedback>
        
      </React.Fragment>
    );
  }
}

PepoButton.defaultProps = {
  disabled: false,
  count: 0
};

export default PepoButton;