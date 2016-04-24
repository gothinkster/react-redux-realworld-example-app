'use strict';

const ListErrors = require('./ListErrors');
const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

class Login extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
    this.changeEmail = ev => store.dispatch({
      type: 'UPDATE_FIELD',
      key: 'email',
      value: ev.target.value
    });
    this.changePassword = ev => store.dispatch({
      type: 'UPDATE_FIELD',
      key: 'password',
      value: ev.target.value
    });
    this.submitForm = ev => {
      ev.preventDefault();
      store.dispatch({
        type: 'LOGIN',
        payload: agent.Auth.login(this.state.email, this.state.password)
      });
    };
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'LOGIN_PAGE_UNLOADED' });
  }

  render() {
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Router.Link to="register">
                  Need an account?
                </Router.Link>
              </p>

              <ListErrors errors={this.state.errors} />

              <form onSubmit={this.submitForm}>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.state.password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.state.inProgress}>
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    );
  }
}

module.exports = Login;
