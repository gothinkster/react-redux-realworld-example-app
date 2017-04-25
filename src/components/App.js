import agent from '../agent';
import Header from './Header';
import React from 'react';
import { connect } from 'react-redux';

import { Provider } from 'mobx-react';
import articlesStore from '../stores/articlesStore';
import authStore from '../stores/authStore';
import commonStore from '../stores/commonStore';
import editorStore from '../stores/editorStore';
import profileStore from '../stores/profileStore';

const stores = {
  articlesStore,
  authStore,
  commonStore,
  editorStore,
  profileStore,
};

// For easier debugging
window._____APP_STATE_____ = stores;

const mapStateToProps = state => ({
  appLoaded: state.common.appLoaded,
  redirectTo: state.common.redirectTo
});

const mapDispatchToProps = dispatch => ({
  onLoad: (payload, token) =>
    dispatch({ type: 'APP_LOAD', payload, token, skipTracking: true }),
  onRedirect: () =>
    dispatch({ type: 'REDIRECT' })
});

class App extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      this.context.router.replace(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }

  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
      profileStore.pullUser()
        .finally(() => stores.commonStore.setAppLoaded());
    } else {
      stores.commonStore.setAppLoaded();
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  render() {
    if (stores.commonStore.appLoaded) {
      return (
        <Provider {...stores}>
          <div>
            <Header
              appName={this.props.appName}
              currentUser={this.props.currentUser} />
            {this.props.children}
          </div>
        </Provider>
      );
    }
    return (
      <Provider {...stores}>
        <Header />
      </Provider>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
