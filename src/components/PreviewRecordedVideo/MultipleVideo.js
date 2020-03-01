import { withNavigation } from 'react-navigation';
import Base from "./Base";

class MultipleVideo extends Base {

    constructor(props){
        super(props);
        this.totalVideos = this.props.videoUrlsList.length || 0;
        this.updateProgressIgnoreOnce = false;
        this.repeat = false;
        this.prevVideosLength = 0;
    }

    handleProgress = (progress) => {
        if(this.isPaused()) return;
        this.currentVideoTime = progress.currentTime;
        let totalProgress = ( this.prevVideosLength / 1000) + this.currentVideoTime,
            val  = totalProgress / ( this.props.totalDuration / 1000);
        if(isNaN(val)) return;
        this.updateProgress(val);
    };

    handleEnd = () => {
       this.changeVideo();
    };

    onVideoLoadError = () => {
        this.changeVideo();
    }

    changeVideo(){
        this.prevVideosLength += this.props.videoUrlsList[this.state.activeIndex].durationInMS;
        let nextVideoIndex  = this.state.activeIndex + 1;
        //Check if all video are played 
        if( nextVideoIndex >= this.totalVideos ){
          //Pause all videos  
          this.pauseVideo();
          //Update progress bar as complete
          this.updateProgress(1);
          //Reset next video Index 
          nextVideoIndex = 0;
          this.prevVideosLength = 0;
        }
        this.seekCount = 0;
        this.currentVideoTime = 0;
        this.setState({activeIndex: nextVideoIndex});
    }

    getVideoUri = () => {
        return {uri : this.props.videoUrlsList[this.state.activeIndex].uri};
    };

    replay = () => {
        this.prevVideosLength = 0;
        super.replay();
    }

}

MultipleVideo.defaultProps = {
    videoUrlsList: []
}

export default withNavigation( MultipleVideo );
