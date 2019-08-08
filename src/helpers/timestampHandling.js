import moment from 'moment';

export default class TimestampHandling {
  static fromNow(tsInSeconds) {
    let tsInMilliSeconds = tsInSeconds * 1000;
    if (Math.abs(moment().diff(tsInMilliSeconds)) < 60 * 1000) {
      // 1000 milliseconds
      return 'just now';
    }
    return moment(tsInMilliSeconds).fromNow();
  }
  static shortenedFromNow(tsInSeconds){
    let timeString = TimestampHandling.fromNow(tsInSeconds)
    if (timeString =='just now'){
      return 'just'
    }
    let splittedTimeString = timeString.split(' ');

    return `${splittedTimeString[0]}${splittedTimeString[1][0]}`;
  }
}
