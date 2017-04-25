import { observable, action } from 'mobx';
import { hashHistory } from 'react-router';
import agent from '../agent';
import profileStore from './profileStore';

const updateToken = (token) => {
  window.localStorage.setItem('jwt', token);
  agent.setToken(token);
};

class AuthStore {
  @observable inProgress = false;
  @observable errors = undefined;

  @observable values = {
    username: '',
    email: '',
    password: '',
  };

  @action setUsername(username) {
    this.values.username = username;
  }

  @action setEmail(email) {
    this.values.email = email;
  }

  @action setPassword(password) {
    this.values.password = password;
  }

  @action reset() {
    this.values.username = '';
    this.values.email = '';
    this.values.password = '';
  }

  @action login() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.login(this.values.email, this.values.password)
      .then(({ user }) => updateToken(user.token))
      .then(() => profileStore.pullUser())
      .then(() => {hashHistory.replace('/')})
      .catch((err) => { this.errors = err.response.body.errors; })
      .finally(() => { this.inProgress = false; });
  }

  @action register() {
    this.inProgress = true;
    this.errors = undefined;
    return agent.Auth.register(this.values.username, this.values.email, this.values.password)
      .then(({ user }) => updateToken(user.token))
      .then(() => profileStore.pullUser())
      .then(() => hashHistory.replace('/'))
      .catch((err) => { this.errors = err.response.body.errors; })
      .finally(() => { this.inProgress = false; });
  }

  @action logout() {
    updateToken(null);
    profileStore.deleteUser();
    hashHistory.replace('/');
  }
}

export default new AuthStore();
