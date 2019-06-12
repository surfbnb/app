import PepoApi from './PepoApi';

export default class PollingHellper {

    constructor( config ){
        this.pollingApi = config.pollingApi || null   ;
        this.pollingMethod = config.pollingMethod ||  'GET'; 
        this.params  =  config.params || null ;
        this.body = config.body || null  ; 

        this.successCallback = config.successCallback || null ;
        this.errorCallback = config.errorCallback || null ; 

        this.pollingInterval =  config.pollingInterval || 2000 ;
        this.maxRetry = config.maxRetry ||  5 ;

        this.currentRetry= 0 ;
        this.pollPromise = null ;

        this.isPolling =  false ; // To check if already polling
        this.shouldPoll =  false ; // To check for next polling

        this.pollingMethod = this.pollingMethod.toLowerCase();
        this.startPolling();
    }

    startPolling() {
        if ( this.isPolling ) {
           //Polling in progress 
          return false;
        }
        this.shouldPoll = true;
        this.isPolling = true;
        this.currentRetry = 0;
        this.poll();
    }

    poll() {
        var oThis = this; 
        if ( this.pollPromise ) {
          //Polling in progress 
          return false;
        }
        const pepoApi = new PepoApi( this.pollingApi , this.params ) ; 
        this.pollPromise = pepoApi[this.pollingMethod](this.body ).then( ( res )=> {
            this.successCallback && this.successCallback(  res );  
            this.complete(); 
        } ).catch(( error ) => { 
            this.currentRetry++;
            this.errorCallback && this.errorCallback( error );  
            this.complete(); 
        }); 
        return true;
    }

    complete(){
        pepoApi = null ;
        this.pollPromise = null ;  
        if( !this.isMaxRetries() ){
            this.scheduleNextPoll();
        }
    }

    isMaxRetries() {
        return this.currentRetry > this.maxRetry ;
    }
    
    scheduleNextPoll() {
        if ( !this.shouldPoll ) {
            this.isPolling = false;
            return;
        }
        setTimeout( () => {
            this.poll();
        }, this.pollingInterval );  
    }

}

