import React, { PureComponent } from 'react';
import ProgressBar from 'react-native-progress/Bar';

class ProgressBarWrapper extends PureComponent {

  constructor(props){
    super(props);
    this.state = {
      progress: 0
    }
  }

  updateProgress(val){
    this.setState({progress: val});
  }

  render(){
    return  <ProgressBar
      width={null}
      color="#EF5566"
      progress={this.state.progress}
      indeterminate={false}
      style={this.props.style}
      useNativeDriver={true}
    />
  }


}

export default ProgressBarWrapper;
