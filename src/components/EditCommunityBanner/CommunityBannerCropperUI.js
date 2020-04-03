import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CrossIcon from '../../assets/cross_icon_white.png';
import ZoomView from '../ZoomView';
import ImageEditor from "@react-native-community/image-editor"; 

export default class CommunityBannerCropperUI extends React.Component {
  constructor(props) {
    super(props);

    this.state= {
      // The overlay view is rendered with the border, this is will hold the
      // value for borderLeft and borderRight.
      borderX: 0,
      // overlay view's borderTop and borderBottom value.
      borderY: 0,
    }

    // A handle of zoom view. This will be used to make function calls on the
    // zoom view.
    this.zoomViewRef = React.createRef();
  }

  componentWillUnmount() {
    // Clear the reference.
    this.zoomViewRef = null;
  }

  // Crop the image
  cropImage(callback) {    
    // Get the current info of the image.
    const currentImagePosition = this.zoomViewRef.current.getImagePosition();
    
    // Calculate the actual starting position / offset of the image.
    const scaledImageViewWidth = currentImagePosition.imageWidth * currentImagePosition.scale;
    const scaledImageViewHeight = currentImagePosition.imageHeight * currentImagePosition.scale;
    const xDiff = ((scaledImageViewWidth-currentImagePosition.viewWidth)/2)/currentImagePosition.scale;
    const yDiff = ((scaledImageViewHeight-currentImagePosition.viewHeight)/2)/currentImagePosition.scale;
    const imageWidth = this.zoomViewRef.current.getImageSize().width;
    const imageHeight = this.zoomViewRef.current.getImageSize().height;
    const scaleFactor = Math.min(imageWidth/currentImagePosition.viewWidth, imageHeight/currentImagePosition.viewHeight);
    const x =  (xDiff - currentImagePosition.positionX)*scaleFactor;
    const y = (yDiff - currentImagePosition.positionY)*scaleFactor;

    // TODO: still work in progress.
    // Calculate the crop image size
    let calculatedWidth = Math.min(imageWidth-x, currentImagePosition.viewWidth*scaleFactor);
    let calculatedHeight = Math.min(imageHeight-y, currentImagePosition.viewHeight*scaleFactor);
    // let calculatedWidth = currentImagePosition.viewWidth;
    // let calculatedHeight = currentImagePosition.viewHeight;

    // Prepare the crop data.
    const cropData = {
      offset: {x: x, y: y},
      size: {width: calculatedWidth, height: calculatedHeight},
      displaySize: {width:currentImagePosition.viewWidth, height: currentImagePosition.viewHeight},
      resizeMode: 'center',
    };

    // Crop the image.
    ImageEditor.cropImage(this.props.imageUri, cropData).then(url => {
      if(callback) {
        callback(url);
      }
    })
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
