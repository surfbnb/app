import { withNavigation } from 'react-navigation';
import Base from "./Base";

class MultipleVideo extends Base {

    constructor(props){
        super(props);
        this.totalVideos = this.props.videoUrlsList.length || 0;
        this.totalCurrentDuration = 0;
    }

    handleProgress = (progress) => {
        if(this.isPaused()) return;
        this.currentVideoTime = progress.currentTime;
        this.totalCurrentDuration = this.totalCurrentDuration + this.currentVideoTime;
        this.updateProgress(this.totalCurrentDuration /( this.totalDuration / 1000) );
    };

    handleEnd = () => {
        const nextVideoIndex  = this.state.activeIndex + 1; 
        //Check if all video are played 
        if( nextVideoIndex >= this.totalVideos ){
          //Pause all videos  
          this.pauseVideo();
          //Update progress bar as complete
          this.updateProgress(1);
          //Reset next video Index 
          nextVideoIndex = 0;
        }
        this.seekCount = 0;
        this.currentVideoTime = this.currentDuration;
        this.setState({activeIndex: nextVideoIndex});
    };

    getVideoUri = () => {
        return {uri : this.props.videoUrlsList[this.state.activeIndex].uri};
    }

    resetAllDefaults(){
        super.resetAllDefaults();
        this.totalCurrentDuration = 0;
    }

}

MultipleVideo.defaultProps = {
    videoUrlsList: []
}

export default withNavigation( MultipleVideo );