import moment from 'moment';

export default class TimestampHandling {
  static fromNow(tsInSeconds) {
    let tsInMilliSeconds = tsInSeconds * 1000;
    if (Math.abs(moment().diff(tsInMilliSeconds)) < 60 * 1000) {
      // 1000 milliseconds
      return 'just now';
    }
    TimestampHandling.setDefaultLocale();
    return moment(tsInMilliSeconds).fromNow(true);
  }
  static shortenedFromNow(tsInSeconds){
    let tsInMilliSeconds = tsInSeconds * 1000;      
    TimestampHandling.updateLocaleForShortTimeFormat(); 
    return moment(tsInMilliSeconds).fromNow(true);      
  }

  static updateLocaleForShortTimeFormat(){
    moment.updateLocale('en', {
      relativeTime : {          
          s  : '%ds',
          ss : '%ds',
          m:  "%dm",
          mm: "%dm",
          h:  "%dh",
          hh: "%dh",
          d:  "%dd",
          dd: "%dd",
          M:  "%dM",
          MM: "%dM",
          y:  "%dy",
          yy: "%dy"
      }
  });
  }

  static setDefaultLocale(){
    moment.updateLocale('en',null);
  } 


}
