import PepoApi from './PepoApi';
import Constants from '../../src/constants/AppConfig';
import Store from '../store';

export default class UploadToS3 {
  constructor(fileURI, fileType) {
    this.fileType = fileType;
    this.mappedFileType = Constants['fileUploadTypes'][fileType];
    this.file = this.getFileObject(fileURI);
  }

  getFileObject(fileURI) {
    let fileExt = this.getFileExtension(fileURI);

    return {
      uri: fileURI,
      type: `${this.fileType}/${fileExt}`,
      name: `${this.fileType}_${Date.now()}.${fileExt}`
    };
  }

  getFileExtension(file) {
    let splittedFileName = file.split('.');
    return splittedFileName[splittedFileName.length - 1];
  }

  perform() {
    return new Promise(async (resolve, reject) => {
      let signedUrl = await this.getSignedUrl();
      if (signedUrl.success) {
        let uploadResp = await this.upload(signedUrl);
        if (uploadResp.status == 204) {
          return resolve(this.uploadParams.s3_url);
        }
        return reject();
      }
      return reject();
    });
  }

  async getSignedUrl() {
    let signedUrlResp = await new PepoApi('/upload-params').get({
      [this.mappedFileType]: [this.file && this.file.name]
    });
    return signedUrlResp;
  }

  async upload(res) {
    (this.uploadParams = this.getUploadParams(res)), (postFields = this.uploadParams.post_fields);

    postFields.push({ key: 'file', value: this.file });

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      body: this.getFormData(this.uploadParams.post_fields)
    };
    try {
      resp = await fetch(this.uploadParams.post_url, options);
    } catch (e) {
      console.log(e);
    }
    return resp;
  }

  getUploadParams(res) {
    let resultType = res.data['result_type'];
    return res.data[resultType][this.mappedFileType][this.file.name];
  }

  getFormData(paramsList) {
    let formData = new FormData();
    paramsList.forEach((param) => {
      formData.append(param['key'], param['value']);
    });
    return formData;
  }
}
