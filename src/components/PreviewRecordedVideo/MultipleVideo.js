import { withNavigation } from 'react-navigation';
import Base from "./Base";

class MultipleVideo extends Base {

    constructor(props){
        super(props);
        this.totalVideos = this.props.videoUrlsList.length || 0;
        this.updateProgressIgnoreOnce = false;
    }

    handleProgress = (progress) => {
        this.currentVideoTime = progress.currentTime;
        let totalProgress = ( this.getPrevVideoDuration() / 1000) + this.currentVideoTime ,
            val  = totalProgress / ( this.props.totalDuration / 1000);
        if(isNaN(val)) return;
        this.updateProgress(val);
    };

    handleEnd = () => {
        let nextVideoIndex  = this.state.activeIndex + 1;
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
        this.currentVideoTime = 0;
        this.setState({activeIndex: nextVideoIndex});
    };

    getPrevVideoDuration = () => {
        if (this.state.activeIndex  < 1){
            return 0;
        }
        return this.props.videoUrlsList[this.state.activeIndex - 1].progress * 100 * 300;
    };

    getVideoUri = () => {
        return {uri : this.props.videoUrlsList[this.state.activeIndex].uri};
    }

}

MultipleVideo.defaultProps = {
    videoUrlsList: []
}

export default withNavigation( MultipleVideo );
