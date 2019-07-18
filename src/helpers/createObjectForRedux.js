class CreateObjectForRedux {
  constructor() {}

  createImageObject(imageObject) {
    let currentTs = Date.now();
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
    let currentTs = Date.now();
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
