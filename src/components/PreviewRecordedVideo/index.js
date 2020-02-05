import React  from 'react';
import SingleVideo from "./SingleVideo";
import MultipleVideo from "./MultipleVideo";

const PreviewRecordedVideo = (props) => {
  if(!!props.previewURL){
    return <SingleVideo  {...props} />
  }else{
    <MultipleVideo  {...props} />
  }
}

export default PreviewRecordedVideo;
