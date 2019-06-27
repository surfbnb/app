import React from 'react';
import { connect } from 'react-redux';
import { View, Modal, Text, Image } from 'react-native';
import * as Progress from 'react-native-progress';

import inlineStyles from './styles';
import Loading_left from '../../../assets/Loading_left.png';
import Loading_right from '../../../assets/Loading_right.png';
import Colors from '../../styles/Colors';
import Store from '../../../store';
import { showModalCover, hideModalCover } from '../../../actions';

const mapStateToProps = ({ modal_cover }) => ({
  show: modal_cover.show,
  message: modal_cover.message,
  footerText: modal_cover.footerText
});

class loadingModalCover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoadingImage: false
    };
  }

  componentDidMount() {
    this.timerIDLoadingImage = setInterval(() => {
      this.props.show &&
        this.setState({
          showLoadingImage: !this.state.showLoadingImage
        });
    }, 800);
  }

  componentWillUnmount() {
    clearInterval(this.timerIDLoadingImage);
  }
  render() {
    return (
      <View>
        {this.props.show && (
          <Modal
            animationType="fade"
            transparent={true}
            visible={this.props.show}
            coverScreen={false}
            hasBackdrop={false}
          >
            <View style={inlineStyles.backgroundStyle}>
              <Image
                style={inlineStyles.loadingImage}
                source={this.state.showLoadingImage ? Loading_right : Loading_left}
              />
              <Text style={inlineStyles.loadingMessage}>{this.props.message}</Text>
              <Progress.Bar
                indeterminate={true}
                indeterminateAnimationDuration={500}
                width={200}
                unfilledColor={Colors.white}
                color={Colors.primary}
                borderWidth={0}
              />
              <Text style={inlineStyles.footerText}>{this.props.footerText}</Text>
            </View>
          </Modal>
        )}
      </View>
    );
  }
}

export const LoadingModalCover = connect(mapStateToProps)(loadingModalCover);
export const LoadingModal = {
  show: (message, footerText) => {
    Store.dispatch(showModalCover(message, footerText));
  },
  hide: () => {
    Store.dispatch(hideModalCover());
  }
};
