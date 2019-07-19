class CreateObjectForRedux {
  constructor() {}

  createImageObject(imageObject) {
    let currentTs = `image_${Date.now()}`;
    return {
      key: currentTs,
      value: {
        [`id_${currentTs}`]: {
          id: currentTs,
          resolutions: {
            original: imageObject
          }
        }
      }
    };
  }
  createVideoObject(videoObject, posterImageId) {
    let currentTs = `video_${Date.now()}`;
    return {
      key: currentTs,
      value: {
        [`id_${currentTs}`]: {
          id: currentTs,
          poster_image_id: posterImageId,
          resolutions: {
            original: videoObject
          }
        }
      }
    };
  }
}

export default new CreateObjectForRedux();
