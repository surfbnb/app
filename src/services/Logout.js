import currentModal from "../models/CurrentUser";

export default class Logout {
  constructor(navigate) {
    this.navigate = navigate;
  }

  async perform() {
    await currentModal.logout( this.navigate );
    return;
  }
}
