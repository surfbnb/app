import React, { Component } from "react";
import { StyleSheet, TouchableOpacity, View, Image, Text } from "react-native";
import { RNCamera } from "react-native-camera";
import captureIcon from "../../assets/capture_icon.png";
import stopIcon from '../../assets/stop_icon.png';
import ProgressBar from "react-native-progress/Bar";


const PROGRESS_FACTOR = 0.01;

class VideoRecorder extends Component {
  // static navigationOptions = {
  //   header: null
  // };
  constructor(props) {
    super(props);
    this.state = {
      //   hasCameraPermission: true,//to explore
      isRecording: false,
      progress: 0,
      recordingInProgress: false
    };
    this.camera = null;
  }

  

  componentDidMount() {
    const { navigation } = this.props;
    navigation.addListener("willFocus", () =>
      this.setState({ focusedScreen: true, progress: 0 })
    );
    navigation.addListener("willBlur", () => {
      this.setState({ focusedScreen: false });
      this.cleanUp();
    });
  }

  componentWillUnmount() {
    //  this.cleanUp();
  }

  cleanUp() {
    this.camera = null;
    clearInterval(this.progressInterval);
  }

  cameraView() {
   
    return (
      <View style={styles.container}>
        <RNCamera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.preview}
          type={RNCamera.Constants.Type.front}
          ratio="16:9"
          zoom={0}
          autoFocusPointOfInterest={{ x: 0.5, y: 0.5 }}
          videoStabilizationMode={RNCamera.Constants.VideoStabilization["auto"]}
          notAuthorizedView={
            <View>
              <Text>The camera is not authorized!</Text>
            </View>
          }
          pendingAuthorizationView={
            <View>
              <Text>The camera is pending authorization!</Text>
            </View>
          }
          defaultVideoQuality={RNCamera.Constants.VideoQuality["480p"]}
          defaultMuted={false}
          androidCameraPermissionOptions={{
            title: "Permission to use camera",
            message: "We need your permission to use your camera",
            buttonPositive: "Ok",
            buttonNegative: "Cancel"
          }}
          androidRecordAudioPermissionOptions={{
            title: "Permission to use audio recording",
            message: "We need your permission to use your audio",
            buttonPositive: "Ok",
            buttonNegative: "Cancel"
          }}
        >
        <ProgressBar
          width={null}
          color="#EF5566"
          progress={this.state.progress}
          indeterminate={false}
          style={styles.progressBar}
        />
          <View
            style={{
              flex: 0,
              flexDirection: "row",
              justifyContent: "center"
            }}
          >
         
          {this.getActionButton()}               
          </View>
        </RNCamera>
      </View>
    );
  }

  stopRecording(){
    // naviagate from here to other page
    this.camera && this.camera.stopRecording();        
  }



  getActionButton(){
    if(this.state.isRecording){
      return ( <TouchableOpacity
        onPress={() => {this.stopRecording()}}        
      >
        <Image style={styles.captureButton} source={stopIcon} />
       </TouchableOpacity> )
    } else {
     return ( <TouchableOpacity
        onPress={this.recordVideoAsync}
      >
        <Image style={styles.captureButton} source={captureIcon} />
       </TouchableOpacity> )
    }
  }

  render() {
    const { focusedScreen } = this.state;
    if (focusedScreen) {
      return this.cameraView();
    } else {
      return <View />;
    }
  }

  

  initProgressBar() {
    this.progressInterval = setInterval(() => {
      if (this.state.progress < 1) {
        this.setState({ progress: this.state.progress + PROGRESS_FACTOR });
      } else {
        this.stopRecording();
      }
    }, 300);
  }

  
  navigateToViewRecording = data => {
    if (this.state.focusedScreen && data) {
      console.log(data.uri);
      this.props.navigation.navigate("ViewRecording", {
        uri: data.uri
        //thumbnail: result.path
      });
      // RNThumbnail.get(data.uri)
      //   .then(result => {
      //     console.log(result.path); // thumbnail path
      //     console.log("I am hereee in RNThumbnail");
      //     this.props.navigation.navigate("ViewRecording", {
      //       uri: data.uri,
      //       thumbnail: result.path
      //     });
      //   })
      //   .catch(err => {
      //     console.log(err);
      //   });
    }
  };

  recordVideoAsync = async () => {
    if (!this.camera) return;
    this.setState({isRecording: true});
      const options = {
        quality: RNCamera.Constants.VideoQuality["480p"],
        base64: true,
        maxDuration: 30,
        muted: false,
        codec: RNCamera.Constants.VideoCodec["H264"],
        orientation: "portrait"
      };
      this.initProgressBar();
      const data = await this.camera.recordAsync(options);
      console.log("data-------------", data);

      this.props.navigation.navigate('PreviewRecordedVideo', {videoUrl: data.uri })
    

  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "black"
  },
  preview: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 35
  },
  capture: {
    flex: 0,
    backgroundColor: "#ff3b30",
    width: 100,
    height: 100,
    borderRadius: 40,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 20,
    borderWidth: 3,
    borderColor: "#fff"
  },
  captureButton: {
    width: 65,
    height: 65,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: "center",
    // margin: 20
  },
  progressBar: {
    borderRadius: 3.5,
    borderColor: "#fff",
    borderWidth: 0.5,
    height: 7,
    width: '90%',
    marginLeft: 10,
    marginRight: 10
  }
});

//make this component available to the app
export default VideoRecorder;
