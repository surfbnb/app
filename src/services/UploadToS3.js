import PepoApi from './PepoApi';
import Constants from '../../src/constants/AppConfig';
import Store from '../store';

export default class UploadToS3 {

  constructor(params) {
    this.file = params.file;
    this.fileType = Constants['fileUploadTypes'][params.fileType];
    console.log(this.fileType, 'this.fileTypefileTypefileTypefileType')
  }

  async perform() {    
    let signedUrl = await this._getSignedUrl()
    let uploadResp = await this._upload(signedUrl);
    return uploadResp;
  }

  async _getSignedUrl() {
    let signedUrlResp = await  new PepoApi('/upload-params').get({ [this.fileType]: [this.file && this.file.name]});
    return signedUrlResp;
       
    
  }

  async _upload(res) {
    let uploadParams = this.getUploadParams(res),
      postFields = uploadParams.post_fields;
    postFields.push( {key:'file', value:  this.file});

    let options = {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      method: 'POST',
      body: this.getFormData(uploadParams.post_fields)
    };
    console.log(uploadParams.post_url, 'uploadParams.post_url');
    console.log(options, 'options');

    let resp  = await fetch(uploadParams.post_url, options);  
    console.log(`response--------------------- ----------- ${resp}`);   
    Store.dispatch(upsertGiffyEntities(this._getEntitiesFromObj(data['gifs']))); 
    return resp;  
  }

  getUploadParams(res) {
    let resultType = res.data['result_type'];
    return res.data[resultType][this.fileType][this.file.name];
  }

  getFormData(paramsList) {
    let formData = new FormData();

    paramsList.forEach(param => {
      formData.append(param['key'], param['value']);
    });

    return formData;
  }
}
