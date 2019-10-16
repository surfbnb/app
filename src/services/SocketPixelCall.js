import CurrentUser from './../models/CurrentUser';

const LOG = 'SocketPixelCall';
class SocketPixelCall {
  constructor() {
    this.isConnected = false;
    this.eventQueue = [];
    this.pepoSocket = null;
  }

  setPepoSocket(pepoSocket) {
    console.log(LOG, "setPepoSocket called");

    //clean up current socket config and listener
    if (this.pepoSocket) {
      this.isConnected = false;
      this.pepoSocket.removeAllListeners('connect');
      this.pepoSocket.removeAllListeners('disconnect');
    }

    this.pepoSocket = pepoSocket;

    //if PepoSocket not present dont subscribe
    if (!pepoSocket) return;

    this.pepoSocket.on('connect', this.onConnect);
    this.pepoSocket.on('disconnect', this.onDisconnect);
  }

  onConnect = () => {
    console.log(LOG, "onConnect");
    this.isConnected = true;
    this.fireBufferedEvent();
  };

  onDisconnect = () => {
    console.log(LOG, "onDisconnect");
    this.isConnected = false;
  };

  fireEvent(events) {
    if (!events || events.length < 1) {
      return;
    }

    if (!Array.isArray(events)) events = [events];

    console.log(LOG, "fireEvent called for events", events);

    //Socket is present And is connected emit the event
    if ( this.pepoSocket && this.isConnected ) {
      this.pepoSocket.emit('pepo-mobile', {messages: events});
      return;
    }

    console.log(LOG, "events", JSON.stringify(events) );

    //Queue up if not able to send the event
    this.pushEventsInBuffer(events);
  }

  pushEventsInBuffer(events) {
    events.forEach((event, index)=> {
      this.eventQueue.push({currentUserId: CurrentUser.getUserId(), data:event});
    });
  }

  fireBufferedEvent() {
    let eventsToFire = [];

    //Filter event of currentUser;
    this.eventQueue.forEach((eventData, index)=> {
      if (eventData.currentUserId == CurrentUser.getUserId()) {
        eventsToFire.push(eventData.data);
      }
    });

    //clean up current queue
    this.eventQueue = [];

    //Fire filtered events
    this.fireEvent(eventsToFire);
  }
}

export default new SocketPixelCall();
