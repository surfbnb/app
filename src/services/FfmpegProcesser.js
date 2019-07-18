import { RNFFmpeg } from '../libs/react-native-ffmpeg';
import AppConfig from '../constants/AppConfig';

export default class FfmpegProcesser {
  constructor(inputFileUri) {
    this.inputFileUri = inputFileUri;
  }

  async compress() {
    this.cancel();
    this._getOutputPath();
    let executeString = this._getExecuteString();
    let compressStartedAt = Date.now();
    console.log('compression started at:', compressStartedAt);
    let executeResponse = await RNFFmpeg.execute(executeString);
    if (executeResponse.rc === 0) {
      // rc = 0, means successful compression
      let compressFinishedAt = Date.now();
      console.log('compression finished successfully at:', compressFinishedAt);
      console.log('Time for compression', compressFinishedAt - compressStartedAt);

      return this.outputPath;
    } else {
      // compression is failed
      console.log('Compression is failed');
      return this.inputFileUri;
    }
  }

  async getVideoThumbnail() {
    console.log('this.coverFileOutputPath this.im in getVideoThumbnail');
    this._getCoverOutputPath();
    console.log('this.coverFileOutputPath this.coverFileOutputPath', this.coverFileOutputPath);
    let executeString = this._getVideoThumbnailString();
    console.log(executeString);
    let executeResponse = await RNFFmpeg.execute(executeString);
    if (executeResponse.rc === 0) {
      console.log('Thumb nail created ', this.outputImageFile);
      // rc = 0, means successful compression
      return this.coverFileOutputPath;
    } else {
      console.log('Thumb nail failed ', this.outputImageFile);
      // compression is failed
      return '';
    }
  }

  _getVideoThumbnailString() {
    return `-i ${this.inputFileUri} -s ${AppConfig.compressionConstants.COMPRESSION_SIZE} -vframes 1 ${this.coverFileOutputPath}`;
    // this.outputImageFile = `output_${Date.now()}.png`;
    // return `-i ${this.inputFileUri} -ss 00:00:01.000 -vframes 1 ${this.outputFileName}`;
  }

  async getFileInformation(file) {
    return await RNFFmpeg.getMediaInformation(file);
  }

  cancel() {
    RNFFmpeg.cancel();
  }

  _getExecuteString() {
    return `-i ${this.inputFileUri} -s ${AppConfig.compressionConstants.COMPRESSION_SIZE} -crf ${AppConfig.compressionConstants.CRF} -preset ${AppConfig.compressionConstants.PRESET} -pix_fmt ${AppConfig.compressionConstants.PIX_FMT} -vcodec h264 ${this.outputPath}`;
  }

  getFileExtension(file) {
    let splittedFileName = file.split('.');
    return splittedFileName[splittedFileName.length - 1];
  }

  _getCoverOutputPath() {
    let inputUriArr = this.inputFileUri.split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    this.outputFileName = `output_${Date.now()}.png`;
    outputPath.push(this.outputFileName);
    this.coverFileOutputPath = outputPath.join('/');
  }

  _getOutputPath() {
    let inputUriArr = this.inputFileUri.split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    this.outputFileName = `output_${Date.now()}.mp4`;
    outputPath.push(this.outputFileName);
    this.outputPath = outputPath.join('/');
  }
}
