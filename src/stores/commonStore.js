import { observable, action } from 'mobx';

class CommonStore {

  @observable appName = 'Conduit';
  @observable token = null;
  @observable viewChangeCounter = 0;
  @observable appLoaded = false;

  @action setAppLoaded() {
    this.appLoaded = true;
  }
}

export default new CommonStore();
