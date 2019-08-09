import moment from 'moment';

const updateLocaleForShortTimeFormat = () => {
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

export const shortenedFromNow = (tsInSeconds) => {
  let tsInMilliSeconds = tsInSeconds * 1000;      
  updateLocaleForShortTimeFormat(); 
  return moment(tsInMilliSeconds).fromNow(true);   
}
