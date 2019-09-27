import EventEmitter from "eventemitter3";

const paymentEventsMap = {
    paymentIAPStarted: "paymentIAPStarted", 
    paymentIAPError : "paymentIAPError", 
    paymentIAPSuccess : "paymentIAPSuccess", 
    paymentBESyncStarted: "paymentBESyncStarted",
    paymentBESyncSuccess: "paymentBESyncSuccess",
    paymentBESyncFailed: "paymentBESyncFailed", 
    paymentStoreSyncStarted: "paymentStoreSyncStarted",  
    paymentStoreSyncSuccess: "paymentStoreSyncSuccess", 
    paymentStoreSyncFailed: "paymentStoreSyncFailed",
    pollPendingPaymentsStart: "pollPendingPaymentsStart",
    pollPendingPaymentsSuccess: "pollPendingPaymentsSuccess",
    pollPendingPaymentsError: "pollPendingPaymentsError"
}

const paymentEvents = new EventEmitter() ; 

export { paymentEvents,  paymentEventsMap , PurchaseLoader } ; 

/**
 * Private UI implementation move this to some other file 
 **/

 class PurchaseLoader {

    constructor( eventCallback  ){
        this.eventCallback =  eventCallback ; 
        this.statusMap = {
            show : "show", 
            hide : "hide"
        }
    }

    subscribeToEvents(){
        paymentEvents.on( paymentEventsMap.paymentIAPSuccess , ( payload ) => {
            this.__eventCallback(this.statusMap.show ,  payload);
        });
        paymentEvents.on( paymentEventsMap.pollPendingPaymentsStart , ( payload ) => {
            this.__eventCallback(this.statusMap.show ,  payload , true );
        });

        paymentEvents.on( paymentEventsMap.paymentBESyncFailed , ( payload ) => {
            this.__eventCallback(this.statusMap.hide , payload);
        });
        paymentEvents.on( paymentEventsMap.pollPendingPaymentsSuccess , ( payload ) => {
            this.__eventCallback(this.statusMap.hide , payload , true );
        });
        paymentEvents.on( paymentEventsMap.pollPendingPaymentsError , ( payload ) => {
            this.__eventCallback(this.statusMap.hide , payload , true);
        });
    }

    unSubscribeToEvents(){
        paymentEvents.removeListener( paymentEventsMap.paymentIAPSuccess);
        paymentEvents.removeListener( paymentEventsMap.pollPendingPaymentsStart);
        paymentEvents.removeListener( paymentEventsMap.paymentBESyncFailed);
        paymentEvents.removeListener( paymentEventsMap.pollPendingPaymentsSuccess);
        paymentEvents.removeListener( paymentEventsMap.pollPendingPaymentsError);
    }

    __eventCallback(status ,  payload , igNoreBackgroundSync ){ 
        const isBackgroundSync = igNoreBackgroundSync ? false : payload && payload.isBackgroundSync ; 
        if(!isBackgroundSync){
            this.eventCallback && this.eventCallback(status , payload ) ;
        }
    }

 }
 