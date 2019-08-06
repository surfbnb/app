import { FetchServices } from './FetchServices';

class Pagination {
   
    constructor(fetchUrl,  callbacks) {
      if(!fetchUrl) return ; 
  
      this.list = [];
      this.results = [];
      this.refreshing =  false ; 
      this.loadingNext =  false ; 
      this.callbacks =  callbacks || {};
      this.fetchUrl = fetchUrl ; 
    }

    initPagination() {
      if(!this.fetchUrl) return ; 
      this.refresh( new FetchServices(this.fetchUrl) );
    }

    refresh(fetchServices) {
      if (this.refreshing) return;
      if (fetchServices) {
        this.fetchServices = fetchServices;
      } else {
        this.fetchServices = this.fetchServices && this.fetchServices.clone();
      }
      if(!this.fetchServices) return;
      this.beforeRefresh();
      this.fetchServices
        .refresh()
        .then((res) => {
          this.onRefresh(res);
        })
        .catch((error) => {
          this.onRefreshError(error);
        });
    };

    beforeRefresh() {
      this.refreshing = true ;  
      this.callbacks.beforeRefresh && this.callbacks.beforeRefresh();
    }

    onRefresh(res) {
      this.refreshing = false ; 
      this.list = this.fetchServices.getIDList(); 
      this.results = this.fetchServices.getAllResults(); 
      this.callbacks.onRefresh && this.callbacks.onRefresh( res );
    }

    onRefreshError(error) {
      this.refreshing = false ; 
      this.callbacks.onRefreshError && this.callbacks.onRefreshError(error);
    }

    /**
     * getNext monitors for 4 different checkpoints
     * 1. It wont call next page if allready fetching data of previous page
     * 2. Wont next page when pull to refresh is done
     * 3. Will stop pagination if next page payload is not present
     */
    getNext(){
      if (
        this.loadingNext ||
        this.refreshing ||
        !this.fetchServices.hasNextPage 
      )
        return;
      this.beforeNext();
      this.fetchServices
        .fetch()
        .then((res) => {
          this.onNext(res);
        })
        .catch((error) => {
          this.onNextError(error);
        });
    };

    beforeNext() {
      this.loadingNext =  true ;  
      this.callbacks.beforeNext && this.callbacks.beforeNext();
    }

    onNext(res) {
        this.loadingNext =  false ; 
        this.list = this.fetchServices.getIDList(); 
        this.results = this.fetchServices.getAllResults();  
        this.callbacks.onNext && this.callbacks.onNext( res );
    }

    onNextError(error) {
      this.loadingNext =  false ;  
      this.callbacks.onNextError && this.callbacks.onNextError(error);
    }

  };


export default Pagination ;