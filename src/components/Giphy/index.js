import React, { Component } from 'react';
import { View, Text, Modal, TouchableHighlight, Image, ImageBackground, TouchableWithoutFeedback, Dimensions } from 'react-native';
import inlineStyles from './styles';
import { TouchableOpacity } from 'react-native-gesture-handler';
import deepGet from 'lodash/get';
import FormInput from '../../theme/components/FormInput';
import PepoApi from '../../services/PepoApi';
import PlusIcon from '../../assets/plus_icon.png';
import styles from '../Authentication/styles';
import Theme from '../../theme/styles';

class Giphy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalOpen: false,
      gifSearchQuery: '',
      gifsCategoryMetaData: [],
      gifsCategoryData: {},
      gifsDataToShow: [],
      isGifCategory: true,
      selectedImage: {}
    };
  }

  componentDidMount() {
    this.getGiphyCategotyData();
  }

  getGiphyCategotyData() {
    let gifApi = new PepoApi('/gifs/categories');
    gifApi
      // .setNavigate(this.props.navigation.navigate)
      .get()
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            gifsCategoryMetaData = deepGet(res, 'data.' + resultType),
            gifsCategoryData = deepGet(res, 'data.gifs');
          this.setState({
            gifsCategoryMetaData,
            gifsCategoryData
          });
          this.genereateGifDataToShow();
        }
      });
  }

  genereateGifDataToShow() {
    console.log('In genereateGifDataToShow');
    let gifsDataToShow = [],
      gifsCategoryMetaData = this.state.gifsCategoryMetaData,
      gifsCategoryData = this.state.gifsCategoryData;
    this.setState({ gifsDataToShow: [] });
    for (let i = 0; i < gifsCategoryMetaData.length; i++) {
      let gifId = gifsCategoryMetaData[i]['gif_id'];
      gifsDataToShow.push({ ...gifsCategoryData[gifId], ...{ name: gifsCategoryMetaData[i]['name'] } });
    }
    this.setState({ gifsDataToShow });

    console.log('In genereateGifDataToShow gifsDataToShow', this.state.gifsDataToShow);
  }

  giphyPickerHandler() {
    console.log('I am here');
    this.setState({
      modalOpen: true
    });
  }

  closeModal() {
    this.setState({
      modalOpen: false
    });
  }

  searchGiphy(gifSearchQuery) {
    this.setState({
      gifSearchQuery
    });
    console.log(gifSearchQuery, 'gifSearchQuerygifSearchQuery');
    let gifApi = new PepoApi('/gifs/search');
    var oThis = this;

    gifApi
      // .setNavigate(this.props.navigation.navigate)
      .get({ query: gifSearchQuery })
      .then((res) => {
        if (res.success && res.data) {
          let resultType = deepGet(res, 'data.result_type'),
            gifsDataToShow = deepGet(res, 'data.' + resultType);
          oThis.setState({
            gifsDataToShow,
            isGifCategory: false
          });
        }
      });
  }

  handleGiphyPress(gifsData, i) {
    return () => {
      if (this.state.isGifCategory) {
        this.searchGiphy(gifsData[i]['name']);
      } else {
        this.selectImage(gifsData[i]);
      }
    };
  }

  selectImage(gifsData) {
    this.closeModal();
    this.setState({
      selectedImage: gifsData
    });
  }

  render() {
    var elements = [];
    var gifsData = this.state.gifsDataToShow;
    var imageSelector;
    for (var i = 0; i < gifsData.length; i++) {

      elements.push(
        <TouchableWithoutFeedback key={i} data-key={i} onPress={this.handleGiphyPress(gifsData, i)}>
          <View>
            <Image
              style={{
                width: parseInt(gifsData[i]['fixed_width_downsampled']['width']) * 0.5,
                height: parseInt(gifsData[i]['fixed_width_downsampled']['height']) * 0.5,
                margin: 5
              }}
              source={{ uri: gifsData[i]['fixed_width_downsampled']['url'] }}
            />
          </View>
        </TouchableWithoutFeedback>
      );
    }

    if (Object.keys(this.state.selectedImage).length) {
      imageSelector = (
        <View>
          <Image
            style={{
              width: parseInt(this.state.selectedImage['fixed_width_downsampled']['width']),
              height: parseInt(this.state.selectedImage['fixed_width_downsampled']['height'])
            }}
            source={{ uri: this.state.selectedImage['fixed_width_downsampled']['url'] }}
          />
        </View>
      );
    } else {
      imageSelector = (
        <View style={inlineStyles.giphyPicker}>
          <Image source={PlusIcon} style={inlineStyles.plusIcon} />
          <Text style={inlineStyles.giphyPickerText}> What do you want to GIF? </Text>
        </View>
      );
    }

    // const screenWidth = Dimensions.get("window").width;

    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            this.giphyPickerHandler();
          }}
        >
          {imageSelector}
        </TouchableOpacity>
        {this.state.modalOpen && (
          <React.Fragment>
            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modalVisible}
              onRequestClose={() => {
                this.closeModal();
              }}
            >
              <View style={inlineStyles.modal}>
                <View style={inlineStyles.modalInner}>
                  <FormInput
                    editable={true}
                    onChangeText={(gifSearchQuery) => this.searchGiphy(gifSearchQuery)}
                    fieldName="gif_category_search_query"
                    textContentType="none"
                    value={this.state.gifSearchQuery}
                    style={[Theme.TextInput.textInputStyle]}
                    placeholder="Search Giphy"
                    returnKeyType="next"
                    returnKeyLabel="next"
                    placeholderTextColor="#ababab"
                    errorHandler={(fieldName) => {
                      this.ServerErrorHandler(fieldName);
                    }}
                  />

                  <View style={{
                    flexWrap: 'wrap',
                    flexDirection: 'column',
                    flexBlockCount: 2,
                    flexBlockFlow: 'cross'
                  }}>
                    {/*<Text>Elements</Text>*/}
                    {elements}
                  </View>

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
