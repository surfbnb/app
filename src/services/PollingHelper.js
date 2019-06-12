import PepoApi from './PepoApi';

export default class PollingHellper {

    constructor(api , method , params , body ){
        this.pollingApi = api ;
        this.pollingMethod =  method || 'GET' ;
        this.pollingMethod = this.pollingMethod.toLowerCase();
        this.params  = params || null  ;
        this.body = body || null ; 

        this.pollPromise = null ;
        this.pollingInterval =  2000 ;

        this.maxRetry =  5 ;
        this.currentRetry= 0 ;

        this.isPolling =  false ; // To check if already polling
        this.shouldPoll =  false ; // To check for next polling
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
        if ( this.pollPromise ) {
          //Polling in progress 
          return false;
        }
        const pepoApi = new PepoApi( this.pollingApi , this.params ) ; 
        this.pollPromise = pepoApi[this.method](this.body ).then( ( res )=> {
            this.complete(); 
            this.success( res );  
        } ).catch(( error ) => {
            this.complete(); 
            this.currentRetry++;
            this.error( error );  
        }); 
        return true;
    }

    success( res ){
        //overwrite
    }

    error( error){
         //overwrite
    }

    complete(){
        pepoApi = null ;
        this.pollPromise = null ;  
    }

    isMaxRetries() {
        return this.currentRetry > this.maxRetry ;
    }
    
    scheduleNextPoll() {
        if ( !this.shouldPoll ) {
            this.isPolling = false;
            return;
        }
        setTimeout(function () {
            this.poll();
        }, this.pollingInterval );  
    }

}

