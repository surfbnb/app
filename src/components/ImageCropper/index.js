import React, { Component } from 'react';
import { Image, ImageEditor, Dimensions, View } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import ImageSize from 'react-native-image-size';

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
    const {
      imageUri,
      cropSize,
      positionX,
      positionY,
      screenSize,
      srcSize,
      scale,
      verticalPadding,
      horzPadding,
      cropperSize
    } = params;
    console.log(
      '---- crop method inputs:',
      '\n imageUri',
      imageUri,
      '\n cropSize',
      cropSize,
      '\n positionX',
      positionX,
      '\n positionY',
      positionY,
      '\n screenSize',
      screenSize,
      '\n srcSize',
      srcSize,
      '\n scale',
      scale,
      '\n verticalPadding',
      verticalPadding,
      '\n horzPadding',
      horzPadding,
      '\n cropperSize',
      cropperSize
    );

    const netImageZoomFactor = srcSize.imgFactor * scale;
    console.log('netImageZoomFactor', netImageZoomFactor);

    const cropperWidth = winWidth - 2 * horzPadding;
    const cropperRadius = cropperWidth / 2;
    const factoredCropperRadius = cropperRadius / netImageZoomFactor;

    const croppedImageDimension = cropperWidth / netImageZoomFactor;
    console.log('croppedImageDimension', croppedImageDimension);
    /* 
      Note about cropperWidth: 
        Since the cropper has to be a square cropperWidth has be used above.  
        Changing to cropperHeight will cause issues. Think about it before changing.
    */

    //Compute X Offset
    const xOffset = ImageCropper.computeXOffSet(factoredCropperRadius, srcSize.transformedW, srcSize.w, positionX);

    //Compute Y Offset.
    const zoomerHeight = cropperSize.h;
    const yCenterCorrection = ImageCropper.computeVerticalAddtionalCorrection(
      zoomerHeight,
      verticalPadding,
      cropperRadius,
      netImageZoomFactor
    );
    const yOffset = ImageCropper.computeYOffSet(
      factoredCropperRadius,
      srcSize.transformedH,
      srcSize.h,
      positionY,
      yCenterCorrection
    );

    const cropData = {
      offset: {
        x: xOffset,
        y: yOffset
      },
      size: {
        width: croppedImageDimension,
        height: croppedImageDimension
      },
      displaySize: {
        width: cropSize.width,
        height: cropSize.height
      },
      resizeMode: 'stretch'
    };

    return new Promise((resolve, reject) => ImageEditor.cropImage(imageUri, cropData, resolve, reject));
  };

  static computeXOffSet(factoredCropperRadius, displayImgWidth, actualImageWidth, zoomerX) {
    /*
      Refer below excel for computation formullas: 
      https://docs.google.com/spreadsheets/d/1X1cTbHCOnQeMcnd-3RkvYssWF9iFPTYN56JkqwG-uZc/edit?usp=sharing
    */
    console.log('--------------- computeXOffSet -----------------');
    console.log('factoredCropperRadius', factoredCropperRadius);
    console.log('displayImgWidth', displayImgWidth);
    console.log('actualImageWidth', actualImageWidth);
    console.log('zoomerX', zoomerX);

    const scaledX = (zoomerX * actualImageWidth) / displayImgWidth;
    console.log('scaledX', scaledX);

    const offsetX = actualImageWidth / 2 - scaledX;
    console.log('offsetX', offsetX);

    const correctOffsetX = offsetX - factoredCropperRadius;
    console.log('correctOffsetX', correctOffsetX);

    return correctOffsetX;
  }

  static computeYOffSet(factoredCropperRadius, displayImgHeight, actualImageHeight, zoomerY, additionalCorrection) {
    /*
      Refer below excel for computation formullas: 
      https://docs.google.com/spreadsheets/d/1X1cTbHCOnQeMcnd-3RkvYssWF9iFPTYN56JkqwG-uZc/edit?usp=sharing
    */
    console.log('--------------- computeYOffSet -----------------');
    console.log('factoredCropperRadius', factoredCropperRadius);
    console.log('displayImgHeight', displayImgHeight);
    console.log('actualImageHeight', actualImageHeight);
    console.log('zoomerY', zoomerY);

    const scaledY = (zoomerY * actualImageHeight) / displayImgHeight;
    console.log('scaledY', scaledY);

    const offsetY = actualImageHeight / 2 - scaledY;
    console.log('offsetY', offsetY);

    let correctOffsetY = offsetY - factoredCropperRadius;
    console.log('correctOffsetY', correctOffsetY);

    // Additional Corrections because the center of croper does not match the center of zoomer.
    console.log('additionalCorrection', additionalCorrection);
    correctOffsetY = correctOffsetY - additionalCorrection;

    console.log('correctOffsetY after additional correction', correctOffsetY);

    return correctOffsetY;
  }

  static computeVerticalAddtionalCorrection(zoomerHeight, verticalPadding, cropperRadius, netImageZoomFactor) {
    let verticalCorrection = zoomerHeight / 2 - (verticalPadding + cropperRadius);
    return verticalCorrection / netImageZoomFactor;
  }

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

    ImageSize.getSize(imageUri).then(sizeInfo => {
      const imgWidth  = sizeInfo.width;
      const imgHeight = sizeInfo.height;
      const { setCropperParams } = this.props;

      const imgSize = { w: imgWidth, h: imgHeight };
      const cropperSize = {
        w: winWidth,
        h: winHeight * this.props.heightRatio
      };

      let minScale = 0;
      let maxScale = 10;
      let imgFactor = 1;

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

      /*
        The minimum scale that zoomer can support in a bug free maner is 1.01.
        Hence, we need to transform the image height width in a way such that 
        at-least one of the dimensions fit (either height or width).
      */
      imgSize.imgFactor = imgFactor;
      imgSize.transformedW = imgSize.w * imgFactor;
      imgSize.transformedH = imgSize.h * imgFactor;

      this.setState(
        (prevState) => ({
          ...prevState,
          cropperSize,
          screenSize,
          srcSize: imgSize,
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
    let { loading, minScale, maxScale, srcSize, cropperSize } = this.state;
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
            backgroundColor: 'black'
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
