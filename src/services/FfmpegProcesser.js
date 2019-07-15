import PepoApi from './PepoApi';
import Constants from '../../src/constants/AppConfig';
import Store from '../store';
import { LogLevel, RNFFmpeg } from '../libs/react-native-ffmpeg';

const COMPRESSION_SIZE = '720X1280';
const CRF = '24';
const PRESET = 'ultrafast';
const PIX_FMT = 'yuv420p';

export default class FfmpegProcesser {
  constructor(inputFile) {
    this.inputFileUri = inputFile.uri;
    this._getCopressedURIPath()
  }

  async compress() {
    let executeString = this._getExecuteString();
    let compressStartedAt = Date.now();
    console.log("compression started at:", compressStartedAt);
    let executeResponse = await RNFFmpeg.execute(executeString);
    if (executeResponse.rc === 0){
      // rc = 0, means successful compression
      let compressFinishedAt = Date.now()    
      console.log("compression finished successfully at:", compressFinishedAt);
      console.log("Time for compression", compressFinishedAt-compressStartedAt);
      
      return this.outputPath; 
    } else {
      // compression is failed
      console.log("Compression is failed");
      return this.inputFileUri;
    }    
  }

  async getFileInformation(file) {
    return await RNFFmpeg.getMediaInformation(file);
  }

  _getExecuteString() {
    return `-i ${
      this.inputFileUri
    } -s ${COMPRESSION_SIZE} -crf ${CRF} -preset ${PRESET} -pix_fmt ${PIX_FMT} -vcodec h264 ${this.outputPath}`;
  }

  _getCopressedURIPath() {
    let inputUriArr = this.inputFileUri.split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    outputPath.push(`output_${Date.now()}.mp4`);
    this.outputPath = outputPath.join('/');
  }
}
