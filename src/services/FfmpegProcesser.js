import { RNFFmpeg } from 'react-native-ffmpeg';
import AppConfig from '../constants/AppConfig';
import RNFS from 'react-native-fs';

class FfmpegProcesser {
  constructor() {}

  init(inputFiles) {
    this.inputFiles = inputFiles;
    console.log(this.inputFiles, 'this.inputFiles');
  }

  compress() {
    return new Promise(async (resolve, reject) => {
      RNFFmpeg.cancel();
      this.getOutputPath();

      let executeString = this.getCompressCommand();
      let compressStartedAt = Date.now();
      console.log('compress: compression started at:', compressStartedAt);
      let executeResponse = await RNFFmpeg.execute(executeString);
      if (executeResponse.rc === 0) {
        // rc = 0, means successful compression
        let compressFinishedAt = Date.now();
        console.log ('compress: compression finished successfully at:', compressFinishedAt);
        console.log ('compress: Time for compression (In ms)', compressFinishedAt - compressStartedAt);
        resolve(this.outputPath);
      } else if (executeResponse.rc == 255) {
        // Forcefully cancelled
        reject('Forcefully cancelled');
      } else {
        // compression is failed
        console.log('Compression is failed', executeResponse.rc);
       // return resolve(this.inputFiles[0]);
        return reject('Compression has failed');
        // return resolve(this.inputFileUri);
      }
    });
  }

  localConcat = () => {
    return new Promise(async (resolve, reject) => {
      RNFFmpeg.cancel();
      var path = this.getTextPath();
      let fileText = '';
      console.log('localConcat::::', path);
      for (let index in this.inputFiles){
        fileText += `file '${this.inputFiles[index]}'\n`
      }
      console.log('fileTextfileText::::', fileText);
      RNFS.writeFile(path, fileText, 'utf8')
        .then(async (success) => {
          console.log('FILE WRITTEN!');
          let executeString = this.getLocalConcatCommand(path);
          let compressStartedAt = Date.now();
          console.log('localConcat: started at:', compressStartedAt);
          let executeResponse = await RNFFmpeg.execute(executeString);
          if (executeResponse.rc === 0) {
            // rc = 0, means successful compression
            let compressFinishedAt = Date.now();
            console.log ('localConcat: localConcat finished successfully at:', compressFinishedAt);
            console.log ('localConcat: Time for localConcat (In ms)', compressFinishedAt - compressStartedAt);
            return resolve(this.localFilePath);
          } else if (executeResponse.rc == 255) {
            // Forcefully cancelled
            reject('Forcefully cancelled');
          } else {
            // compression is failed
            console.log('localConcat is failed', executeResponse.rc);
            // return resolve(this.inputFiles[0]);
            return reject('localConcat has failed');
            // return resolve(this.inputFileUri);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  };

  getVideoInfo = async ()=> {
    let strToExecute = `-i ${this.inputFiles.length > 0 && this.inputFiles[0]} `;
    let executeResponse = await RNFFmpeg.getMediaInformation(this.inputFiles[0]);
    console.log('******** executeResponse', executeResponse, 'strToExecute', strToExecute);
    return executeResponse

  };

  getTextPath = () => {
    let inputUriArr = this.inputFiles[0].split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);

    outputPath.push(`test.txt`);
    this.testPath = outputPath.join('/');
    return this.testPath;
  };

  getLocalConcatCommand = (path) => {
    return `-f concat -safe 0 -i ${path} -codec copy ${this.getLocalFilePath()}`;

    let command = '';
    let complexFilter = '';
    for (let index in this.inputFiles){
      command +=  `-i ${this.inputFiles[index]} `;
      complexFilter += `[${index}:v][${index}:a]`
    }
    command += `-filter_complex ${complexFilter}concat=n=${this.inputFiles.length}:v=1:a=1[v][a] -map [v] -map [a] ${this.getLocalFilePath()}`;
    return command;
  };

  getIntermediateFile = (index) => {
    let inputUriArr = this.inputFiles[0].split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);

    outputPath.push(`intermediate${index}.ts`);
    return outputPath.join('/');
  };



  getLocalFilePath = () => {
    let inputUriArr = this.inputFiles[0].split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);

    outputPath.push(`output_local_${Date.now()}.mp4`);
    this.localFilePath = outputPath.join('/');
    return this.localFilePath;
  };

  getCompressCommand(){
    let command = '';
    let complexFilter = '';
    for (let index in this.inputFiles){
      command +=  `-i ${this.inputFiles[index]} `;
      complexFilter += `[${index}:v][${index}:a]`
    }
    command += `-filter_complex ${complexFilter}concat=n=${this.inputFiles.length}:v=1:a=1[v][a] -map [v] -map [a] -s ${AppConfig.compressionConstants.COMPRESSION_SIZE} -crf ${AppConfig.compressionConstants.CRF} -preset ${AppConfig.compressionConstants.PRESET} -pix_fmt ${AppConfig.compressionConstants.PIX_FMT} -vcodec h264 ${this.outputPath}`;
    return command;
  }

  cancel() {
    RNFFmpeg.cancel();
  }

  getVideoThumbnail() {
    return new Promise(async (resolve, reject) => {
      if (this.inputFiles.length < 1){
        return reject();
      }
      this.getCoverOutputPath();
      let executeString = `-i ${this.inputFiles[0]} -s ${AppConfig.compressionConstants.COMPRESSION_SIZE} -vframes 1 -q:v 10 ${this.coverFileOutputPath}`;
      console.log(executeString);
      RNFFmpeg.cancel();
      let executeResponse = await RNFFmpeg.execute(executeString);
      if (executeResponse.rc === 0) {
        // rc = 0, means successful compression
        return resolve(this.coverFileOutputPath);
      } else {
        console.log('================== thumbnail create failed ==================');
        // compression is failed
        return reject();
      }
    });
  }

  async getFileInformation(file) {
    return await RNFFmpeg.getMediaInformation(file);
  }

  getCoverOutputPath() {
    let inputUriArr = this.inputFiles[0].split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    this.outputFileName = `output_${Date.now()}.jpg`;
    outputPath.push(this.outputFileName);
    this.coverFileOutputPath = outputPath.join('/');
  }

  getOutputPath() {
    let inputUriArr = this.inputFiles[0].split('/');
    let outputPath = inputUriArr.slice(0, inputUriArr.length - 1);
    this.outputFileName = `output_${Date.now()}.mp4`;
    outputPath.push(this.outputFileName);
    this.outputPath = outputPath.join('/');
  }
}

export default new FfmpegProcesser();
