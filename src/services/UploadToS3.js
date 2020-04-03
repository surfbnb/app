import PepoApi from './PepoApi';
import Constants from '../../src/constants/AppConfig';
import deepGet from "lodash/get";


import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';

export default class UploadToS3 {
  constructor(fileURIs, fileType) {
    this.fileType = fileType;
    this.mappedFileType = Constants['fileUploadTypes'][fileType];
    this.files = this.getFileObject(fileURIs);
  }

  getFileObject(fileURIs) {
    let fileObjectArray = [];
    for (let index in fileURIs){
      let fileExt = this.getFileExtension(fileURIs[index]);
      fileObjectArray.push({
        uri: fileURIs[index],
        type: `${this.fileType}/${fileExt}`,
        name: `${this.fileType}_${Date.now()}_${index}.${fileExt}`
      })
    }

    return fileObjectArray;
  }

  getFileExtension(file) {
    let splittedFileName = file.split('.');
    return splittedFileName[splittedFileName.length - 1];
  }

  perform() {
    return new Promise(async (resolve, reject) => {
      this.getSignedUrl().then (async (signedUrlResp)=>{
      let uploadResp,
        listOfS3Urls = [];
      if (signedUrlResp.success) {
        try {
          let resultType = deepGet(signedUrlResp,'data.result_type');
          let fileNames =  deepGet(signedUrlResp,`data.${resultType}.${this.mappedFileType}`);

          for (let key in fileNames){
            uploadResp = await this.upload(fileNames[key], key);
            if (uploadResp.resp.status === 204 && uploadResp.uploadParams.s3_url) {
              listOfS3Urls.push(uploadResp.uploadParams.s3_url);
            } else {
              return reject();
            }
          }
          return resolve(listOfS3Urls);
        } catch(e){
          return reject();
        }
      }
      }).catch(()=> {
        return reject();
      });
    });
  }

  async getSignedUrl() {
    return new Promise((resolve, reject)=>{

      let fileNamesArray = this.files.map((fileObj)=>{ return fileObj.name });
      new PepoApi('/upload-params').get({
        [this.mappedFileType]: fileNamesArray
      }).then((res)=>{
        return resolve(res);
      }).catch(()=>{
        return reject();
      });
    });
  }

  async upload(uploadParams, fileName) {
    let resp;
    // let uploadParams = fileName;
    let postFields = uploadParams.post_fields;

    let file = this.files.filter((item) => { return item.name === fileName });
    postFields.push({ key: 'file', value: file.length && file[0] });

    try{
      let options = {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        method: 'POST',
        body: this.getFormData(uploadParams.post_fields)
      };
      resp = await fetch(uploadParams.post_url, options);
    } catch(e){
      console.log('Error', e);
    }
    return {resp, uploadParams};
  }

  getFormData(paramsList) {
    let formData = new FormData();
    paramsList.forEach((param) => {
      formData.append(param['key'], param['value']);
    });
    return formData;
  }

  static async GetCleanImagePath ( uri ,width, height,format='JPEG',quality=25, rotation= 0, outputPath=null ){
    if(!uri || !width || !height) return Promise.reject();
    if (Platform.OS === 'ios') {
      outputPath = outputPath || `${RNFS.CachesDirectoryPath}/Pepo/${new Date().getTime()}.jpg`;
      try {
        const success = await ImageResizer.createResizedImage(uri, width, height, format, quality, rotation, outputPath);
        return success.path;
      }
      catch (e) { }
    } else {
      return uri;
    }
  }

}
