import deepGet from 'lodash/get';
import PepoApi from '../../services/PepoApi';
const CATEGORY_VC_ID = 'CATEGORY';

const VCErrors = {
  AlreadyFetchingError: 'AlreadyFetchingError',
  NoMoreRecords: 'NoMoreRecords',
  InvalidApiResponse: 'InvalidApiResponse'
};

class GiffyViewContext {
  constructor(id, url, searchTerm, extraParams) {
    this.id = id;
    this.url = url;
    this.searchTerm = searchTerm;
    this.isFetching = false;
    this.hasNextPage = true;
    this.nextPagePayload = null;
    this.results = [];
    this.resultMap = {};
    this.extraParams = extraParams;
  }

  getUrlParams() {
    let params = {};
    if (this.extraParams) {
      Object.assign(params, this.extraParams);
    }
    if (this.searchTerm) {
      params.query = this.searchTerm;
    }
    if (this.nextPagePayload) {
      Object.assign(params, this.nextPagePayload);
    }
    return params;
  }

  fetch() {
    console.log('==here', this);
    if (this.isFetching) {
      return Promise.reject({
        code_error: VCErrors.AlreadyFetchingError
      });
    }

    if (!this.hasNextPage) {
      return Promise.reject({
        code_error: VCErrors.NoMoreRecords
      });
    }

    this.isFetching = true;
    let api = new PepoApi(this.url);

    return api
      .get(this.getUrlParams())
      .then((response) => {
        console.log('api.get then response', response, !response, !response.success, !response.data);
        if (!response || !response.success || !response.data) {
          return Promise.reject(response);
        }
        console.log('api.get calling dataReceived');
        this.isFetching = false;
        return this.dataReceived(response);
      })
      .catch((err) => {
        this.isFetching = false;
        return Promise.reject(err);
      });
  }

  dataReceived(response) {
    let data = response.data;
    let meta = data.meta;
    this.nextPagePayload = meta ? meta.next_page_payload : null;
    this.hasNextPage = this.nextPagePayload ? true : false;
    let dataToAppend = this.processData(response);
    this.isFetching = false;
    return dataToAppend;
  }

  processData(response) {
    console.log('processData entry');
    let data = response.data;
    let resultType = data.result_type;
    if (!resultType || !data[resultType]) {
      response.code_error = VCErrors.InvalidApiResponse;
      // Invalid response.
      throw response;
    }
    let results = data[resultType];
    if (!(results instanceof Array)) {
      response.code_error = VCErrors.InvalidApiResponse;
      // Invalid response.
      throw response;
    }
    let cleanedUpList = [];
    let cnt = 0,
      len = results.length;
    for (; cnt < len; cnt++) {
      let result = results[cnt];
      let resultId = result.id;

      // Format Data.
      result = this.formatResult(result, response);
      let existingResult = this.resultMap[resultId];
      // Update existing result if available.
      if (!result || existingResult) {
        result && Object.assign(existingResult, result);
        continue;
      }

      // Add new result.
      this.resultMap[resultId] = result;
      this.results.push(result);
      cleanedUpList.push(result);
    }
    console.log('processData exit. cleanedUpList.length:', cleanedUpList.length);
    return cleanedUpList;
  }

  formatResult(result, response) {
    return result;
  }

  getAllResults() {
    return this.results;
  }
}

class CategoryViewContext extends GiffyViewContext {
  constructor() {
    super(CATEGORY_VC_ID, '/gifs/categories');
  }
  formatResult(category, response) {
    if (!category) {
      return;
    }

    let resultType = deepGet(response, 'data.result_type'),
      gifs = deepGet(response, 'data.gifs');
    (gifId = category.gif_id), (gifData = gifs[gifId]);

    if (!gifData) {
      console.log('CategoryViewContext.formatResult exit gifData null. gifId:', gifId);
      return;
    }
    let result = {
      id: category.id,
      gifsUrl: category.url,
      name: category.name,
      isCategory: true
    };

    result = Object.assign({}, gifData, result);
    return result;
  }
}

export { GiffyViewContext, CategoryViewContext, VCErrors, CATEGORY_VC_ID };
