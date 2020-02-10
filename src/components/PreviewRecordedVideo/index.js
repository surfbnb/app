import React  from 'react';
import SingleVideo from "./SingleVideo";
import MultipleVideo from "./MultipleVideo";

const PreviewRecordedVideo = React.forwardRef((props, ref) => {
    if(!!props.previewURL){
      return <SingleVideo  {...props} ref={ref}/>
    }else{
      return  <MultipleVideo  {...props} ref={ref}/>
    }
 });

export default PreviewRecordedVideo;
