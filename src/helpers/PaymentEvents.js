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
    pollPendingPaymentsStart: "pollPendingPayments",
    pollPendingPaymentsSuccess: "pollPendingPaymentsSuccess",
    pollPendingPaymentsError: "pollPendingPaymentsError"
}

const paymentEvents = new EventEmitter() ; 

export { paymentEvents,  paymentEventsMap }

 