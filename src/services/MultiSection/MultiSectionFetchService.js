import {FetchServices, VCErrors} from '../../services/FetchServices';
import PepoApi from "../PepoApi";


class MultiSectionFetchService extends FetchServices{
  constructor(url, params, id , options = {}){
    super(url, params, id , options);
    this.multiSectionResultMap = {};
    this.resultArray = [];


  }


  cloneInstance() {
    throw new Error('MultiSectionFetchService does not support cloning');
    // because we have not tested it.
    let Constructor = this.constructor;
    return new Constructor(this.url, this.extraParams, this.id, this.options);
  }


  processSectionData = (result, data) => {
    let resultArrayKey = result.result_array;
    this.multiSectionResultMap[result.id] = this.multiSectionResultMap[result.id] || {};

    let sectionData = this.multiSectionResultMap[result.id];
    Object.assign(sectionData, result);

    sectionData['data'] = [...sectionData['data'] || [] , ...data[resultArrayKey]];
    return sectionData;
  };


  temporaryManipulateTopData = async (data) => {
    let knownResultType = "tag_videos";
    let customResultType = "xyz";
    data.search_categories.push({id: "sc_vr",
      uts: 1571218577,
      kind: "videos",
      title: "Videos",
      result_array: customResultType
    });


    let res  = await new PepoApi(`/tags/1/videos`).get();

    for (let key in res.data){
      if(key === 'result_type'){
        continue;
      } else if ( key === knownResultType ) {
        data[customResultType] = res.data[knownResultType];
        continue;
      }
      data[key]= res.data[key];
    }
    return data;
  };






    async  processData(response) {
    let data = response.data;
    data = await this.temporaryManipulateTopData(data);
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
    for ( ;cnt < len; cnt++) {
      let result = results[cnt];
      let resultId = result.id;
      if (!this.resultArray.includes(resultId)){
        this.resultArray.push(resultId);
      }
      this.processSectionData(result, data);
    }
  }

  getAllResults(){
    let result = [];
    for (let i = 0 ; i < this.resultArray.length; i++){
      result.push(this.multiSectionResultMap[this.resultArray[i]]);
    }
    console.log(result);
    return result;
  }
}


export default MultiSectionFetchService;