import { FetchServices } from './FetchServices';
import EventEmitter from "eventemitter3";

class Pagination {
   
    constructor(fetchUrl,  callbacks) {
  
      this.list = [];
      this.results = [];
      this.refreshing =  false ; 
      this.loadingNext =  false ; 
      this.callbacks =  callbacks || {};
      this.fetchUrl = fetchUrl ; 

      this.event = new EventEmitter();

    }

    initPagination() {
      if(!this.fetchUrl) return ;
      this.fetchServices = new FetchServices(this.fetchUrl); 
      this.refresh( this.fetchServices );
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
      this.event.emit("beforeRefresh"); 
    }

    onRefresh(res) {
      this.refreshing = false ; 
      this.list = this.fetchServices.getIDList(); 
      this.results = this.fetchServices.getAllResults(); 
      this.callbacks.onRefresh && this.callbacks.onRefresh( res );
      this.event.emit("onRefresh"); 
    }

    onRefreshError(error) {
      this.refreshing = false ; 
      this.callbacks.onRefreshError && this.callbacks.onRefreshError(error);
      this.event.emit("onRefreshError");
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
      this.event.emit("beforeNext");
    }

    onNext(res) {
        this.loadingNext =  false ; 
        this.list = this.fetchServices.getIDList(); 
        this.results = this.fetchServices.getAllResults();  
        this.callbacks.onNext && this.callbacks.onNext( res );
        this.event.emit("onNext");
    }

    onNextError(error) {
      this.loadingNext =  false ;  
      this.callbacks.onNextError && this.callbacks.onNextError(error);
      this.event.emit("onNextError");
    }

  };


export default Pagination ;