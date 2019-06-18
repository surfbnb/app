import PepoApi from '../../services/PepoApi';

const VCErrors = {
  AlreadyFetchingError: 'AlreadyFetchingError',
  NoMoreRecords: 'NoMoreRecords',
  InvalidApiResponse: 'InvalidApiResponse'
};

let idCnt = 1;

class FetchComponent {
  constructor(url, params, id = 'fcomp_' + String(idCnt++)) {
    this.id = id;
    this.url = url;
    this.extraParams = params;
    this.initVals();
  }

  initVals() {
    this.isFetching = false;
    this.hasNextPage = true;
    this.nextPagePayload = null;
    this.results = [];
    this.meta = null;
    this.resultMap = {};
  }

  getUrlParams() {
    let params = {};
    if (this.extraParams) {
      Object.assign(params, this.extraParams);
    }
    if (this.nextPagePayload) {
      Object.assign(params, this.nextPagePayload);
    }
    return params;
  }

  fetch() {
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
        setTimeout(() => {
          this.isFetching = false;
        }, 100);
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
    this.meta = meta;
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

  refresh() {
    this.initVals();
    return this.fetch();
  }

  formatResult(result, response) {
    return result;
  }

  getAllResults() {
    return this.results;
  }

  getIDList(key = 'id') {
    return this.results.map((item) => item[key]);
  }

  clone() {
    let Constructor = this.constructor;
    return new Constructor(this.url, this.extraParams, this.id);
  }
}

export { FetchComponent, VCErrors };
