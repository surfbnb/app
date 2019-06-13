import { OstWalletWorkFlowCallback } from '@ostdotcom/ost-wallet-sdk-react-native';
import Store from '../../store';

const WordFlowEvents = {
  requestAcknowledged: 1,
  flowComplete: 2,
  flowInterrupt: 3
};

function getEventKey(workflowId, event) {
  return workflowId + '_' + String(event);
};

const pubMap = {};
let cbCnt = 0;


class PubSubWorkflow extends OstWalletWorkFlowCallback {
  constructor() {
    super();
  }

  static subscribe(workflowId, event, callback) {
    let eventKey = getEventKey(workflowId, event);
    let callbacks = pubMap[eventKey] = pubMap[eventKey] || {};
    let callbackIndex = ++cbCnt;
    let callbackId = "PubSubWorkflow_callback_" + callbackIndex;
    callbacks[ callbackId ] = callback;
    return callbackId;
  }

  static unsubscribe(workflowId, event, callbackId ) {
    let eventKey = getEventKey(workflowId, event);
    let callbacks = pubMap[eventKey] = pubMap[eventKey] || {};
    // if ( callbacks[callbackId] ) {
    //   callbacks[callbackId] = null;
    // }
    delete callbacks[callbackId];
  }

  static _fireEvent(workflowId, event, ...args) {
    let eventKey = getEventKey(workflowId, event);
    let callbacks = pubMap[eventKey] = pubMap[eventKey] || {};
    for( let callbackId in callbacks ) { if ( callbacks.hasOwnProperty( callbackId ) ) {
      let cb = callbacks[ callbackId ];
      try {
        // it's ok. This magic works.
        setTimeout( cb, 10, ...args);
      } catch (e) {
        // Ignore.
      }
    }};
    //Clean Up.
    pubMap[eventKey] = null;
  }


  /**
   * Request acknowledged
   * @param {Object} ostWorkflowContext - info about workflow type
   * @param ostContextEntity - info about entity
   * @override
   */
  requestAcknowledged(ostWorkflowContext, ostContextEntity) {
    _fireEvent( this.getWorkflowId(), WordFlowEvents.requestAcknowledged, ostWorkflowContext, ostContextEntity );
  }

  /**
   * Flow complete
   * @param ostWorkflowContext - workflow type
   * @param ostContextEntity -  status of the flow
   * @override
   */
  flowComplete(ostWorkflowContext, ostContextEntity) {
    _fireEvent( this.getWorkflowId(), WordFlowEvents.flowComplete, ostWorkflowContext, ostContextEntity );
  }

  /**
   * Flow interrupt
   * @param ostWorkflowContext workflow type
   * @param ostError reason of interruption
   * @override
   */
  flowInterrupt(ostWorkflowContext, ostError) {
    _fireEvent( this.getWorkflowId(), WordFlowEvents.flowInterrupt, ostWorkflowContext, ostError );
  }

  getWorkflowId() {
    return this.uuid;
  }
}

export {
  WordFlowEvents,
  PubSubWorkflow
}
