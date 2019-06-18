import deepGet from 'lodash/get';
const CATEGORY_VC_ID = 'CATEGORY';
import { FetchServices } from '../../services/FetchServices';

class CategoryViewContext extends FetchServices {
  constructor() {
    super('/gifs/categories', {}, CATEGORY_VC_ID);
  }

  formatResult(category, response) {
    if (!category) {
      return;
    }

    let resultType = deepGet(response, 'data.result_type'),
      gifs = deepGet(response, 'data.gifs'),
      gifId = category.gif_id,
      gifData = gifs[gifId];

    if (!gifData) {
      console.log('CategoryViewContext.formatResult exit gifData null. gifId:', gifId);
      return;
    }
    let result = {
      id: category.id,
      gifsUrl: category.url,
      name: category.name,
      isCategory: true
    };

    result = Object.assign({}, gifData, result);
    return result;
  }
}

export { CategoryViewContext, CATEGORY_VC_ID };
