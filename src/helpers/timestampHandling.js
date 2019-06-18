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
}
