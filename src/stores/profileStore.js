import { observable, action } from 'mobx';
import agent from '../agent';

class ProfileStore {

  @observable currentUser;
  @observable loadingUser;
  @observable updatingUser;
  @observable updatingUserErrors;

  @action pullUser() {
    this.loadingUser = true;
    return agent.Auth.current()
      .then(action(({ user }) => { this.currentUser = user; }))
      .finally(() => { this.loadingUser = false; })
  }

  @action updateUser(user) {
    this.updatingUser = true;
    return agent.Auth.save(user)
      .then(action(({ errors }) => { this.updatingUserErrors = errors; }))
      .finally(() => { this.updatingUser = false; })
  }

  @action deleteUser() {
    this.currentUser = undefined;
  }
}

export default new ProfileStore();
