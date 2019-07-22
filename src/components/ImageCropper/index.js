import React, { Component } from 'react';
import { Image, ImageEditor, Dimensions, SafeAreaView } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';

const window = Dimensions.get('window');
const winWidth = window.width;
const winHeight = window.height;

const getPercentFromNumber = (percent, numberFrom) => (numberFrom / 100) * percent;

const getPercentDiffNumberFromNumber = (number, numberFrom) => (number / numberFrom) * 100;

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
    // const { imageUri, cropSize, positionX, positionY, screenSize, srcSize, fittedSize, scale } = params;
    // const offset = {
    //   x: 0,
    //   y: 0
    // };
    // const wScale = screenSize.w / scale;
    // const percentCropperAreaW = getPercentDiffNumberFromNumber(wScale, fittedSize.w);
    // const percentRestW = 100 - percentCropperAreaW;
    // const hiddenAreaW = getPercentFromNumber(percentRestW, fittedSize.w);
    // const percentCropperAreaH = getPercentDiffNumberFromNumber(wScale, fittedSize.h);
    // const percentRestH = 100 - percentCropperAreaH;
    // const hiddenAreaH = getPercentFromNumber(percentRestH, fittedSize.h);
    // const x = hiddenAreaW / 2 - positionX;
    // const y = hiddenAreaH / 2 - positionY;
    // offset.x = x <= 0 ? 0 : x;
    // offset.y = y <= 0 ? 0 : y;
    // const srcPercentCropperAreaW = getPercentDiffNumberFromNumber(offset.x, fittedSize.w);
    // const srcPercentCropperAreaH = getPercentDiffNumberFromNumber(offset.y, fittedSize.h);
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
    console.log('handleImageLoad called');
    const { imageUri } = this.props;

    Image.getSize(imageUri, (imgWidth, imgHeight) => {
      const { setCropperParams } = this.props;

      const imgSize = { w: imgWidth, h: imgHeight };
      const cropperSize = {
        w: winWidth,
        h: winHeight * this.props.heightRatio
      };

      let minScale = 1;
      let maxScale = 10;

      const fittedSize = { w: 0, h: 0 };
      if (imgSize.w < cropperSize.w) {
        let minWidthScale = cropperSize.w / imgSize.w;
        minScale = Math.max(minScale, minWidthScale);
      }

      if (imgSize.h < cropperSize.h) {
        let minHeightScale = cropperSize.h / imgSize.h;
        minScale = Math.max(minScale, minHeightScale);
      }
      const screenSize = {
        w: winWidth,
        h: winHeight
      };

      // if (imgWidth > imgHeight) {
      //   const ratio = winWidth / imgHeight;
      //   fittedSize.w = imgWidth * ratio;
      //   fittedSize.h = winWidth;
      // } else if (imgWidth < imgHeight) {
      //   const ratio = winWidth / imgWidth;
      //   fittedSize.w = winWidth;
      //   fittedSize.h = imgHeight * ratio;
      // } else if (imgWidth === imgHeight) {
      //   minScale = 1;
      //   fittedSize.w = winWidth;
      //   fittedSize.h = winWidth;
      // }

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

    return !loading ? (
      <SafeAreaView
        style={{
          backgroundColor: 'black',
          height: winHeight * this.props.heightRatio
        }}
      >
        <ImageZoom
          ref={this.imageZoom}
          {...restProps}
          cropWidth={winWidth}
          cropHeight={winHeight * this.props.heightRatio}
          imageWidth={srcSize.w}
          imageHeight={srcSize.h}
          minScale={minScale}
          maxScale={maxScale}
          onMove={this.handleMove}
          enableCenterFocus={true}
          style={{
            backgroundColor: 'red'
          }}
        >
          <Image style={{ width: this.state.srcSize.w, height: this.state.srcSize.h }} source={imageSrc} />
        </ImageZoom>
      </SafeAreaView>
    ) : null;
  }
}

ImageCropper.defaultProps = {
  heightRatio: 1
};

export default ImageCropper;
