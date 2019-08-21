import React, { PureComponent } from 'react';
import { TextInput } from 'react-native';

import styles from './styles';

class VideoDescription extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <React.Fragment>
        <TextInput
          multiline= {true}
          editable = {true}
          autoFocus= {true}
          placeholder= "Write something about your video"
          style={styles.videoDescription}
        >
          Write something about your video
        </TextInput>
      </React.Fragment>
    );
  }
}

export default VideoDescription;
