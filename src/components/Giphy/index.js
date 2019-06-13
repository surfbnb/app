import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, Image } from 'react-native';
import inlineStyles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import deepGet from 'lodash/get';
import { showModal, hideModal } from '../../actions';
import PepoApi from '../../services/PepoApi';
import PlusIcon from '../../assets/plus_icon.png';
import styles from '../Authentication/styles';

class Giphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false
    };
  }

  componentDidMount() {
    let gifApi = new PepoApi('/gifs/categories');

    gifApi
      // .setNavigate(this.props.navigation.navigate)
      .get({ query: 'world cup' })
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            gifsCategoryMetaData = deepGet(res, 'data.' + resultType),
            gifCategoryData = deepGet(res, 'data.gifs');
          this.setState({
            gifsCategoryMetaData,
            gifsCategoryData
          });
        }
      });
  }

  giphyPickerHandler() {
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.giphyPickerHandler();
          }}
        >
          <View style={inlineStyles.giphyPicker}>
            <Image source={PlusIcon} style={inlineStyles.plusIcon} />
            <Text style={inlineStyles.giphyPickerText}> What do you want to GIF? </Text>
          </View>
        </TouchableOpacity>
        {this.state.modalOpen && (
          <React.Fragment>
            <View style={{ flexDirection: 'column', flex: 0.3 }}></View>
            <Modal
              style={inlineStyles.modal}
              animationType="slide"
              transparent={false}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.closeModal();
              }}
            >
              <View style={{ marginTop: 22 }}>
                <View>
                  <Text>Hello World!</Text>

                  <TouchableHighlight
                    onPress={() => {
                      this.setModalVisible(!this.state.modalVisible);
                    }}
                  >
                    <Text>Hide Modal</Text>
                  </TouchableHighlight>
                </View>
              </View>
            </Modal>
          </React.Fragment>
        )}
      </View>
    );
  }
}

export default Giphy;
