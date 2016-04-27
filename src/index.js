'use strict';

const ReactDOM = require('react-dom');
const React = require('react');
const Router = require('react-router');
const agent = require('./agent');
const history = require('history');
const store = require('./store');

const Article = require('./components/Article');
const Editor = require('./components/Editor');
const Header = require('./components/Header');
const Home = require('./components/Home');
const Login = require('./components/Login');
const Profile = require('./components/Profile');
const ProfileFavorites = require('./components/ProfileFavorites');
const Register = require('./components/Register');
const Settings = require('./components/Settings');

class App extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    store.subscribe(() => {
      this.setState(store.getState());

      if (store.getState().redirectTo) {
        this.context.router.replace(store.getState().redirectTo);
        store.dispatch({ type: 'REDIRECT' });
      }
    });

    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    store.dispatch({
      type: 'APP_LOAD',
      token: token,
      payload: token ? agent.Auth.current() : null,
      skipTracking: true
    });
  }

  render() {
    if (this.state.appLoaded) {
      return (
        <div>
          <Header state={this.state} />
          {this.props.children}
        </div>
      );
    }
    return (
      <div>
        <Header state={this.state} />
      </div>
    );
  }
}

App.contextTypes = {
  router: React.PropTypes.object.isRequired
};

ReactDOM.render((
  <Router.Router history={Router.hashHistory}>
    <Router.Route path="/" component={App}>
      <Router.IndexRoute component={Home} />
      <Router.Route path="login" component={Login} />
      <Router.Route path="register" component={Register} />
      <Router.Route path="editor" component={Editor} />
      <Router.Route path="editor/:slug" component={Editor} />
      <Router.Route path="article/:id" component={Article} />
      <Router.Route path="settings" component={Settings} />
      <Router.Route path="@:username" component={Profile} />
      <Router.Route path="@:username/favorites" component={ProfileFavorites} />
    </Router.Route>
  </Router.Router>
), document.getElementById('main'));
