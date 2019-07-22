import { RNFFmpeg } from '../libs/react-native-ffmpeg';
import AppConfig from '../constants/AppConfig';

class FfmpegProcesser {
  constructor() {}

  init(inputFileUri) {
    this.inputFileUri = inputFileUri;
  }

  compress() {
    return new Promise(async (resolve, reject) => {
      RNFFmpeg.cancel();
      this.getOutputPath();
      let executeString = `-i ${this.inputFileUri} -s ${AppConfig.compressionConstants.COMPRESSION_SIZE} -crf ${AppConfig.compressionConstants.CRF} -preset ${AppConfig.compressionConstants.PRESET} -pix_fmt ${AppConfig.compressionConstants.PIX_FMT} -vcodec h264 ${this.outputPath}`;
      let compressStartedAt = Date.now();
      console.log('compress: compression started at:', compressStartedAt);
      let executeResponse = await RNFFmpeg.execute(executeString);
      if (executeResponse.rc === 0) {
        // rc = 0, means successful compression
        let compressFinishedAt = Date.now();
        console.log('compress: compression finished successfully at:', compressFinishedAt);
        console.log('compress: Time for compression (In ms)', compressFinishedAt - compressStartedAt);

        return resolve(this.outputPath);
      } else {
        // compression is failed
        console.log('Compression is failed');
        return resolve(this.inputFileUri);
      }
    });
  }

  getVideoThumbnail() {
    return new Promise(async (resolve, reject) => {
      this.getCoverOutputPath();
      let executeString = `-i ${this.inputFileUri} -s ${AppConfig.compressionConstants.COMPRESSION_SIZE} -vframes 1 ${this.coverFileOutputPath}`;
      console.log(executeString);
      RNFFmpeg.cancel();
      let executeResponse = await RNFFmpeg.execute(executeString);
      if (executeResponse.rc === 0) {
        console.log('getVideoThumbnail: Thumbnail created ', this.outputImageFile);
        // rc = 0, means successful compression
        return resolve(this.coverFileOutputPath);
      } else {
        console.log('getVideoThumbnail: Thumbnail failed ', this.outputImageFile);
        // compression is failed
        return reject();
      }
    });
  }

  async getFileInformation(file) {
    return await RNFFmpeg.getMediaInformation(file);
  }

  getCoverOutputPath() {
    let inputUriArr = this.inputFileUri.split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    this.outputFileName = `output_${Date.now()}.png`;
    outputPath.push(this.outputFileName);
    this.coverFileOutputPath = outputPath.join('/');
  }

  getOutputPath() {
    let inputUriArr = this.inputFileUri.split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    this.outputFileName = `output_${Date.now()}.mp4`;
    outputPath.push(this.outputFileName);
    this.outputPath = outputPath.join('/');
  }
}

export default new FfmpegProcesser();
