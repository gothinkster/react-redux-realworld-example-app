import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import ListErrors from './ListErrors';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  UPDATE_FIELD_AUTH,
  LOGIN,
  LOGIN_PAGE_UNLOADED
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = dispatch => ({
  onChangeEmail: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'email', value }),
  onChangePassword: value =>
    dispatch({ type: UPDATE_FIELD_AUTH, key: 'password', value }),
  onSubmit: (email, password) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () =>
    dispatch({ type: LOGIN_PAGE_UNLOADED })
});

const Login = ({ auth, onChangeEmail, onChangePassword, onSubmit, onUnload }) => {
  const { email, password, errors, inProgress } = auth;

  const changeEmail = ev => onChangeEmail(ev.target.value);
  const changePassword = ev => onChangePassword(ev.target.value);
  const submitForm = (email, password) => ev => {
    ev.preventDefault();
    onSubmit(email, password);
  };

  useEffect(() => {
    return () => onUnload();
  }, []);

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">

          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <Link to="/register">
                Need an account?
              </Link>
            </p>

            <ListErrors errors={errors} />

            <form onSubmit={submitForm(email, password)}>
              <fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={changeEmail} />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={changePassword} />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={inProgress}>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);
