import React, { Component } from 'react';
import { Image, View} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import inlineStyles from './styles';

export default class ZoomView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // Indicates that the image size is available.
            isImageSizeAvailable: false,

            // Indicates that the container view side is available.
            isViewSizeAvailable: false,

            // The zoom view will be not rendered if this value if false.
            // This is set to true when `isImageSizeAvailable` and
            // `isViewSizeAvailable` both are available
            isReadyForLayout: false,

            // The container view width.
            viewBoundWidth: 0,

            // The container view height.
            viewBoundHeight: 0,

            // The image width.
            imageWidth: 0,

            // The image height.
            imageHeight: 0,
        }

        this.imageZoomRef = React.createRef();
        this.currentImageUri = this.props.imageUri;
    }

    componentDidMount() {
        // Once the component is mounted, get the image dimensions.
        this.updateImageDimensions(this.props.imageUri)
    }

    componentDidUpdate(prevProps) {
        if (this.props.imageUri !== prevProps.imageUri) {
            this.imageZoomRef.current.reset();
            this.currentImageUri = this.props.imageUri
            this.updateImageDimensions(this.props.imageUri);
        }
      }
    
    componentWillUnmount() {
        this.imageZoomRef = null;
    }

    // Get the image dimensions and update the state variable.
    updateImageDimensions(imageUrl) {
        if(imageUrl === undefined) return;

        Image.getSize(imageUrl, (width, height) => {
            if(this.currentImageUri === imageUrl) {
                // The image width and height is available.
                const newLayout = {
                    imageWidth: width,
                    imageHeight: height,
                    // Set it to true as the image size is available.
                    isImageSizeAvailable: true,
                    // If the view size is also available then the zoom view is
                    // ready for rendering.
                    isReadyForLayout: this.state.isViewSizeAvailable,
                }
    
                // Update the state variable.
                this.setState((prevState) => ({
                    ...prevState,
                    ...newLayout
                  }));    
            }
        }, (failure)=>{
            // TODO: check with team, we should not use console.logs.
            console.log('Image fetch fail: ', failure);
        });
    }

    // This is a callback when the container view is rendered.
    onViewLayout(event) {
        // Get the layout object from the events.
        const layout = event.nativeEvent.layout;
        
        // This function can be called multiple times, check if the view size
        // is changed, if not changed don't do anything.
        if(layout.height === this.state.viewBoundHeight
            && layout.width === this.state.viewBoundWidth){
            return;
        }

        const newLayout = {
            viewBoundX:layout.x,
            viewBoundY:layout.y,
            viewBoundWidth:layout.width,
            viewBoundHeight:layout.height,
            // The view size is available.
            isViewSizeAvailable: true,
            // If the image size is also available then the zoom view is ready
            // for rendering.
            isReadyForLayout: this.state.isImageSizeAvailable,
        }

        // Update the state variables.
        this.setState((prevState) => ({
            ...prevState,
            ...newLayout
          }));
    }

    // Return the latest image position.
    getImagePosition() {
        return this.imageZoomRef.current.getImagePosition();
    }

    // Return the image size.
    getImageSize() {
        return {width: this.state.imageWidth, height:this.state.imageHeight};
    }

    // This function checks if the zoom view is ready for rendering, if yes
    // then it returns the zoom view else it returns just a blank view.
    getZoomView() {
        // Check if the image and container size is available.
        if (this.state.isReadyForLayout) {
            // Calculate the view size and image size ratios.
            const xScale = this.state.viewBoundWidth/this.state.imageWidth;
            const yScale = this.state.viewBoundHeight/this.state.imageHeight;

            // The image will be multiplied with the scaling factors so that
            // the image will aspect fill the zoom view.
            let scaleFactor = xScale > yScale ? xScale : yScale;

            // Calculate the required image size.
            const imageSize = {
                width: this.state.imageWidth*scaleFactor,
                height: this.state.imageHeight*scaleFactor,
            }
            // Calculate the max zoom limit.
            const xZoom = imageSize.width/this.props.maxZoomWidth;
            const yZoom = imageSize.height/this.props.maxZoomHeight;
            const maxScale = Math.min(xZoom,yZoom);
            return (
                <ImageZoom 
                    ref={this.imageZoomRef}
                    style={{...inlineStyles.imageZoom, ...imageSize}}
                    cropWidth={this.state.viewBoundWidth}
                    cropHeight={this.state.viewBoundHeight}
                    imageWidth={imageSize.width}
                    imageHeight={imageSize.height}
                    //maxScale={Math.max(maxScale, 1.001)}
                    // TODO
                    maxScale={2}
                    minScale={1.001}
                >
                    <Image 
                        onLayout={(event)=>{console.log(event.nativeEvent.layout)}}
                        style={{...inlineStyles.image,...imageSize}}
                        source={{uri:this.props.imageUri}}/> 
                </ImageZoom>  
            );
              
        } else {
            return (<View></View>);
        }
    }
    render() {
        return (
            <View
                style={inlineStyles.zoomContainer}
                onLayout={(event)=>{this.onViewLayout(event)}}
            >
                {this.getZoomView()}
            </View>
        )
    }
}
