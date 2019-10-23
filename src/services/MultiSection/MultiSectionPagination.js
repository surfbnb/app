import Pagination from "../Pagination";
import {FetchServices} from "../FetchServices";
import MultiSectionFetchService from './MultiSectionFetchService';
class MultiSectionPagination extends Pagination{


  constructor(fetchUrl,  callbacks ,  fetchServices) {
    super(fetchUrl,  callbacks ,  fetchServices);
    this.fetchServices = fetchServices || new MultiSectionFetchService(this.fetchUrl);
  }

  initPagination() {
    this.refresh( new MultiSectionFetchService(this.fetchUrl));
  }


}

export default MultiSectionPagination;