import PepoApi from './PepoApi';

class PixelCall {
  constructor(data) {
    this.data = data;
  }

  perform() {
    console.log(this.data);
  }
}


export default PixelCall;
