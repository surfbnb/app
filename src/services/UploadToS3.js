import PepoApi from './PepoApi';
import Constants from '../../src/constants/AppConfig';
import Store from '../store';

export default class UploadToS3 {
  constructor(fileURIs, fileType) {
    this.fileType = fileType;
    this.mappedFileType = Constants['fileUploadTypes'][fileType];
    this.files = this.getFileObject(fileURIs);
    console.log(this.files, 'this.filesthis.filesthis.filesthis.files');
  }

  getFileObject(fileURIs) {
    let fileObjectArray = [];
    for (let fileURI of fileURIs){
      let fileExt = this.getFileExtension(fileURI);
      fileObjectArray.push({
        uri: fileURI,
        type: `${this.fileType}/${fileExt}`,
        name: `${this.fileType}_${Date.now()}.${fileExt}`
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
      let uploadResp, listOfS3Urls;
      if (signedUrlResp.success) {
        try {
          let resultType = signedUrlResp.data['result_type'];
          let fileNames =  signedUrlResp.data[resultType][this.mappedFileType];


          for (let fileName of fileNames){

            uploadResp = await this.upload(fileName);

            if (uploadResp.resp.status == 204) {
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
      console.log(fileNamesArray, 'fileNamesArrayfileNamesArray');



      new PepoApi('/upload-params').get({
        [this.mappedFileType]: fileNamesArray
      }).then((res)=>{
        return resolve(res);
      }).catch(()=>{
        return reject();
      });
    });
  }

  async upload(fileName) {
    let resp;
    let uploadParams = this.getUploadParams(fileName);
    let postFields = uploadParams.post_fields;

    postFields.push({ key: 'file', value: fileName });

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      body: this.getFormData(uploadParams.post_fields)
    };
    try {
      resp = await fetch(uploadParams.post_url, options);
    } catch (e) {
      console.log(e);
      throw(1);
    }
    return {resp, uploadParams};
  }

  getUploadParams(fileName) {
    let resultType = res.data['result_type'];
    return res.data[resultType][this.mappedFileType][fileName];
  }

  getFormData(paramsList) {
    let formData = new FormData();
    paramsList.forEach((param) => {
      formData.append(param['key'], param['value']);
    });
    return formData;
  }
}
