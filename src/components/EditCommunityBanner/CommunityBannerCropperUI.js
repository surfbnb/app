import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CrossIcon from '../../assets/cross_icon_white.png';
import ZoomView from '../ZoomView';
import ImageEditor from "@react-native-community/image-editor"; 

export default class CommunityBannerCropperUI extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      borderX: 0,
      borderY: 0,
    }
    this.zoomViewRef = React.createRef();
  }

  componentWillUnmount() {
    this.zoomViewRef = null;
  }

  // Crop the image
  cropImage(callback) {
    // Get the latest state of the image.
    const currentImagePosition = this.zoomViewRef.current.getImagePosition();

    console.log('------------------------------');
    console.log('currentImagePosition: ', currentImagePosition);
    const scaledImageViewWidth = currentImagePosition.imageWidth * currentImagePosition.scale;
    const scaledImageViewHeight = currentImagePosition.imageHeight * currentImagePosition.scale;

    const xDiff = ((scaledImageViewWidth-currentImagePosition.viewWidth)/2)/currentImagePosition.scale;
    const yDiff = ((scaledImageViewHeight-currentImagePosition.viewHeight)/2)/currentImagePosition.scale;

    console.log('xDiff: ', xDiff);
    console.log('yDiff: ', yDiff);

    const diffWidth = Math.abs(currentImagePosition.imageWidth-currentImagePosition.viewWidth)/2;
    const diffHeight = Math.abs(currentImagePosition.imageHeight-currentImagePosition.viewHeight)/2;
    
    console.log('diffWidth: ', diffWidth);
    console.log('diffHeight: ', diffHeight);
    const x =  Math.abs(currentImagePosition.positionX - xDiff);
    const y = (yDiff - currentImagePosition.positionY) + diffHeight;

    const {width, height} = this.zoomViewRef.current.getImageSize();

    console.log('width: ', width);
    console.log('height: ', height);
    console.log('currentImagePosition.imageWidth : ', currentImagePosition.imageWidth );
    console.log('currentImagePosition.imageHeight: ', currentImagePosition.imageHeight);


    const scaledViewWidth = currentImagePosition.viewWidth * currentImagePosition.scale;
    const scaledViewHeight = currentImagePosition.viewHeight * currentImagePosition.scale;



    const xScale = Math.abs(scaledImageViewWidth - width)/width;
    const yScale = Math.abs(scaledImageViewHeight-height)/height;
    console.log('xScale: ', xScale);
    console.log('yScale: ', yScale);

     // Prepare the crop data.
    const cropData = {
      offset: {x: x*xScale, y: y*yScale},
      size: {width: width, height: height},
      displaySize: {width: this.props.minCropWidth, height: this.props.minCropHeight},
      resizeMode: 'contain',
    };

    console.log('cropData: ', cropData);

    ImageEditor.cropImage(this.props.imageUri, cropData).then(url => {
      console.log("Cropped image uri", url);
      if(callback) {
        callback(url);
      }
    })

    // // Calculate the diff
    // const xDiff = Math.abs((currentImagePosition.viewWidth - currentImagePosition.imageWidth)/4);
    // const yDiff = Math.abs((currentImagePosition.viewHeight - currentImagePosition.imageHeight)/4);

    // console.log('------------------------------');
    // console.log('positionX: ', currentImagePosition.positionX);
    // console.log('positionY: ', currentImagePosition.positionY);
    // console.log('scale: ', currentImagePosition.scale);
    // // console.log('zoomCurrentDistance: ', currentImagePosition.zoomCurrentDistance);
    // // console.log('imageWidth: ', currentImagePosition.imageWidth);
    // // console.log('imageHeight: ', currentImagePosition.imageHeight);
    // // console.log('viewWidth: ', currentImagePosition.viewWidth);
    // // console.log('viewHeight: ', currentImagePosition.viewHeight);
    
    // console.log('scaledXdiff: ', xDiff);
    // console.log('originalPositionX :',((xDiff - currentImagePosition.positionX)/currentImagePosition.scale));
    // // const centerX = currentImagePosition.imageWidth/2;
    // const centerY = currentImagePosition.imageHeight/2;
    // console.log('Center X: ', centerX);
    // console.log('Center Y: ', centerY);


    // const diffWidth = Math.abs(currentImagePosition.imageWidth-currentImagePosition.viewWidth);
    // const diffHeight = Math.abs(currentImagePosition.imageHeight-currentImagePosition.viewHeight);
    
    // const padding = Math.max(diffWidth,diffHeight)/2;

    // let xOffset = 0;
    // let yOffset = 0;
    // if(diffWidth > 0) {
    //   xOffset = padding;
    //   yOffset = padding/2;
    // } else if(diffHeight > 0) {
    //   xOffset = padding/2;
    //   yOffset = padding;
    // }

    
    // console.log('offset x: ', xOffset);
    // console.log('offset y: ', yOffset);

    // console.log('calculated x: ', currentImagePosition.positionX+xOffset);
    // console.log('calculated y: ', currentImagePosition.positionY+yOffset);

    // const scaledImageWidth = currentImagePosition.imageWidth*currentImagePosition.scale;
    // console.log('scaledImageWidth: ', scaledImageWidth);
    // const diffWidth = scaledImageWidth - currentImagePosition.imageWidth;
    // console.log('diffWidth: ', diffWidth);
    // console.log('diffWidth/2: ', diffWidth/2);
    // console.log('xDiff/2: ', xDiff/2);
    // console.log('yDiff/2: ', yDiff/2);
    // console.log('x+xDiff: ', x+xDiff);
    // console.log('y+yDiff: ', y+yDiff);

    // // Check if the image is not scaled.
    // if(currentImagePosition.scale === 1.001) {
    //   x = currentImagePosition.positionX;
    //   y =currentImagePosition.positionY;  
    // } else {
    //   // Extract the exact frame.x and frame.y from the data.
    //   x = currentImagePosition.positionX/currentImagePosition.scale;
    //   y = currentImagePosition.positionY/currentImagePosition.scale;  
    // }

    // // Prepare the crop data.
    // const cropData = {
    //   offset: {x: Math.floor(x+xDiff), y: Math.floor(y+yDiff)},
    //   size: {width: this.props.minCropWidth, height: this.props.minCropHeight},
    //   displaySize: {width: this.props.minCropWidth, height: this.props.minCropHeight},
    //   resizeMode: 'contain',
    // };

    // console.log('cropData: ', cropData);
  }

  // Dynamically calculate the overlay borders.
  updateOverlayLayout(event) {
    // Get the layout object from the events.
    const layout = event.nativeEvent.layout;

    let overlayWidth = this.props.minCropWidth;
    let overlayHeight = this.props.minCropHeight;

    const widthScale = (overlayWidth - layout.width)/layout.width;
    const heightScale = (overlayHeight - layout.height)/layout.height;

    if(widthScale>heightScale) {
      overlayHeight = this.props.minCropHeight*(layout.width/overlayWidth);
      overlayWidth = layout.width;
    } else {
      overlayWidth = this.props.minCropHeight*(layout.height/overlayHeight);
      overlayHeight = layout.height;
    }
    const borderX = (layout.width - overlayWidth)/2;
    const borderY = (layout.height - overlayHeight)/2;

    // Check if the border value is changed.
    if(borderX !== this.state.borderX || borderY !== this.state.borderY) {
      const border = {
        borderX: borderX,
        borderY: borderY,
      }
      // Update the state variable.
      this.setState((prevState) => ({
        ...prevState,
        ...border
      }));
    }
  }

  render() {
    // This border styles will be applied to overlay view.
    const borderStyle = {
      borderTopWidth:this.state.borderY,
      borderBottomWidth:this.state.borderY,
      borderLeftWidth:this.state.borderX,
      borderRightWidth:this.state.borderX,
    };

    // This padding styles will be applied to the zoom view container.
    const paddingStyle = {
      paddingTop: this.state.borderY,
      paddingBottom: this.state.borderY,
      paddingLeft: this.state.borderX,
      paddingRight: this.state.borderX
    };

    return (
      // This is the container view. Once the layout is done the border and
      // padding values are calculated.
      <View style={styles.container} onLayout={(event)=>{this.updateOverlayLayout(event)}}>

        {/* This is the zoom container view. */}
        <View style={{...styles.zoomViewContainer, ...paddingStyle}}>
            <ZoomView
              ref={this.zoomViewRef}
              imageUri={this.props.imageUri}
              maxZoomWidth={this.props.minCropWidth}
              maxZoomHeight={this.props.minCropHeight}
            />
        </View>

        {/* This is the overlay view. */}
        <View pointerEvents="none" style={{...styles.overlayView, ...borderStyle,}}/>

        {/* This is the close button */}
        <TouchableOpacity style={styles.crossIconWrapper} onPress={this.props.onClose}>
           <Image style={styles.crossIconSkipFont} source={CrossIcon}/>
        </TouchableOpacity>
      </View>
    );
  }
}

// Styles used in this component.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden'
  },
  zoomViewContainer: {
    width:'100%',
    height: '100%',
    backgroundColor:'black',
    overflow: 'visible'
  },
  overlayView: {
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'transparent',
    position: 'absolute',
    borderColor:'rgba(0, 0, 0, 0.6)',
  },
  crossIconWrapper: {
    position: 'absolute',
    top: 10,
    left: 0,
    height: 60,
    width: 60,
    zIndex:9
  },
  crossIconSkipFont: {
    marginTop: Platform.OS == 'android' ? 20 : 0,
    marginLeft: 20,
    height: 20,
    width: 20
  }
});
