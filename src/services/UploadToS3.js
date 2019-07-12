import PepoApi from './PepoApi';
import Constants from '../../src/constants/AppConfig';
import Store from '../store';

export default class UploadToS3 {

  constructor(file, fileType) {
    this.file = file;
    this.fileType = Constants['fileUploadTypes'][fileType];
  }

  async perform() {    
    let signedUrl = await this._getSignedUrl()
    let uploadResp = await this._upload(signedUrl);
    if (uploadResp.status == 204){
      return this.uploadParams.s3_url;
    } 
    return '';  
  }

  async _getSignedUrl() {
    let signedUrlResp = await  new PepoApi('/upload-params').get({ [this.fileType]: [this.file && this.file.name]});
    return signedUrlResp;    
  }

  async _upload(res) {
    this.uploadParams = this._getUploadParams(res),
      postFields = this.uploadParams.post_fields;

      
    postFields.push( {key:'file', value:  this.file});

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      body: this._getFormData(this.uploadParams.post_fields)
    };

    let resp  = await fetch(this.uploadParams.post_url, options);  
    console.log(resp, 'resp');
    return resp;  
  }

  _getUploadParams(res) {
    let resultType = res.data['result_type'];
    return res.data[resultType][this.fileType][this.file.name];
  }

  _getFormData(paramsList) {
    let formData = new FormData();
    paramsList.forEach(param => {
      formData.append(param['key'], param['value']);
    });
    console.log('formData', formData);
    return formData;
  }
}
