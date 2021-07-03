import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListErrors from './ListErrors';
import { login, loginPageUnloaded } from '../reducers/auth';

/**
 * Login form component
 *
 * @param {import('react-router-dom').RouteComponentProps} props
 * @example
 * <Login />
 */
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassWord] = useState('');
  const dispatch = useDispatch();
  const { errors, inProgress } = useSelector(state => state.auth);

  useEffect(() => () => dispatch(loginPageUnloaded()), []);

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeEmail = event => {
    setEmail(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changePassword = event => {
    setPassWord(event.target.value);
  };

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const submitForm = event => {
    event.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign In</h1>
            <p className="text-xs-center">
              <Link to="/register">Need an account?</Link>
            </p>

            <ListErrors errors={errors} />

            <form onSubmit={submitForm}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={changeEmail}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={changePassword}
                  />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={inProgress}
                >
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

export default Login;
