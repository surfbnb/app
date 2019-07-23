import React, { Component } from 'react';
import { Image, ImageEditor, Dimensions, SafeAreaView, View } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const window = Dimensions.get('window');
const winWidth = window.width;
const winHeight = window.height;
const w = window.width;
const h = window.height;

const getPercentFromNumber = (percent, numberFrom) => (numberFrom / 100) * percent;

const getPercentDiffNumberFromNumber = (number, numberFrom) => (number / numberFrom) * 100;

const verticalPadding = 40;
const horizontalPadding = 30;

export { getPercentFromNumber, getPercentDiffNumberFromNumber };

class ImageCropper extends Component {
  constructor() {
    super();
    this.imageZoom = React.createRef();
  }

  state = {
    positionX: 0,
    positionY: 0,
    width: 0,
    height: 0,
    minScale: 0,
    adjustedHeight: 0,
    loading: true
  };

  static crop = (params) => {
    const { imageUri, cropSize, positionX, positionY, screenSize, srcSize, scale, verticalPadding } = params;
    console.log(
      'imageUri, cropSize, positionX, positionY, screenSize, srcSize, scale ',
      imageUri,
      cropSize,
      positionX,
      positionY,
      screenSize,
      srcSize,
      scale
    );

    let correctedY = positionY - verticalPadding;
    // const offset = {
    //   x: 0,
    //   y: 0
    // };
    // const wScale = screenSize.w / scale;
    // const percentCropperAreaW = getPercentDiffNumberFromNumber(wScale, srcSize.w);
    // const percentRestW = 100 - percentCropperAreaW;
    // const hiddenAreaW = getPercentFromNumber(percentRestW, srcSize.w);
    // const percentCropperAreaH = getPercentDiffNumberFromNumber(wScale, srcSize.h);
    // const percentRestH = 100 - percentCropperAreaH;
    // const hiddenAreaH = getPercentFromNumber(percentRestH, srcSize.h);
    // const x = hiddenAreaW / 2 - positionX;
    // const y = hiddenAreaH / 2 - positionY;
    // offset.x = x <= 0 ? 0 : x;
    // offset.y = y <= 0 ? 0 : y;
    // const srcPercentCropperAreaW = getPercentDiffNumberFromNumber(offset.x, srcSize.w);
    // const srcPercentCropperAreaH = getPercentDiffNumberFromNumber(offset.y, srcSize.h);
    // const offsetW = getPercentFromNumber(srcPercentCropperAreaW, srcSize.w);
    // const offsetH = getPercentFromNumber(srcPercentCropperAreaH, srcSize.h);
    // const sizeW = getPercentFromNumber(percentCropperAreaW, srcSize.w);
    // const sizeH = getPercentFromNumber(percentCropperAreaH, srcSize.h);
    // offset.x = offsetW;
    // offset.y = offsetH;
    // const cropData = {
    //   offset,
    //   size: {
    //     width: sizeW,
    //     height: sizeH
    //   },
    //   displaySize: {
    //     width: cropSize.width,
    //     height: cropSize.height
    //   }
    // };
    // console.log('cropdata', cropData);
    // return new Promise((resolve, reject) => ImageEditor.cropImage(imageUri, cropData, resolve, reject));
  };

  componentDidMount() {
    this.handleImageLoad();
  }

  componentWillUnmount() {
    this.imageZoom = null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.imageUri !== prevProps.imageUri) {
      this.handleImageLoad();
    }
  }

  handleImageLoad = () => {
    const { imageUri } = this.props;

    Image.getSize(imageUri, (imgWidth, imgHeight) => {
      const { setCropperParams } = this.props;

      const imgSize = { w: imgWidth, h: imgHeight };
      const cropperSize = {
        w: winWidth,
        h: winHeight * this.props.heightRatio
      };

      let minScale = 0;
      let maxScale = 10;
      let imgFactor = 1;

      const fittedSize = { w: 0, h: 0 };

      let minWidthScale = cropperSize.w / imgSize.w;
      let minHeightScale = cropperSize.h / imgSize.h;
      minScale = Math.max(minHeightScale, minWidthScale);
      if (minScale <= 1) {
        imgFactor = minScale / 1.01;
        minScale = 1.01;
      }

      const screenSize = {
        w: winWidth,
        h: winHeight
      };

      imgSize.imgFactor = imgFactor;
      imgSize.transformedW = imgSize.w * imgFactor;
      imgSize.transformedH = imgSize.h * imgFactor;
      this.setState(
        (prevState) => ({
          ...prevState,
          cropperSize,
          screenSize,
          srcSize: imgSize,
          fittedSize,
          minScale: minScale,
          maxScale: maxScale,
          loading: false
        }),
        () => {
          console.log('center on called');
          this.imageZoom.current.centerOn({
            x: 0,
            y: 0,
            scale: minScale,
            duration: 0
          });
          setCropperParams(this.state);
        }
      );
    });
  };

  handleMove = ({ positionX, positionY, scale }) => {
    console.log('HandleMove', positionX, positionY, scale);
    const { setCropperParams } = this.props;
    this.setState(
      (prevState) => ({
        ...prevState,
        positionX,
        positionY,
        scale
      }),
      () => setCropperParams(this.state)
    );
  };

  render() {
    let { loading, fittedSize, minScale, maxScale, srcSize, cropperSize } = this.state;
    let { imageUri, ...restProps } = this.props;
    let imageSrc = { uri: imageUri };

    if (!loading) {
      console.log('cropperSize', cropperSize);
      console.log('srcSize', srcSize);
      console.log('minScale', minScale);
    }

    console.log(restProps, 'restProps');

    return !loading ? (
      <View
        style={{
          backgroundColor: 'black',
          height: winHeight * this.props.heightRatio
        }}
      >
        <ImageZoom
          ref={this.imageZoom}
          cropWidth={winWidth}
          cropHeight={winHeight * this.props.heightRatio}
          imageWidth={srcSize.transformedW}
          imageHeight={srcSize.transformedH}
          minScale={minScale}
          maxScale={maxScale}
          onMove={this.handleMove}
          style={{
            backgroundColor: 'red'
          }}
        >
          <Image
            style={{ width: this.state.srcSize.transformedW, height: this.state.srcSize.transformedH }}
            source={imageSrc}
          />
        </ImageZoom>
      </View>
    ) : null;
  }
}

ImageCropper.defaultProps = {
  heightRatio: 1
};

export default ImageCropper;
