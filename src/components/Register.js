import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListErrors from './ListErrors';
import { register, registerPageUnloaded } from '../reducers/auth';

/**
 * Register form component
 *
 * @param {import('react-router-dom').RouteComponentProps} props
 * @example
 * <Register />
 */
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { errors, inProgress } = useSelector(state => state.auth);

  useEffect(() => () => dispatch(registerPageUnloaded()), []);

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeUsername = event => {
    setUsername(event.target.value);
  };

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
    setPassword(event.target.value);
  };

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const submitForm = event => {
    event.preventDefault();
    dispatch(register({ username, email, password }));
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign Up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>

            <ListErrors errors={errors} />

            <form onSubmit={submitForm}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Username"
                    autoComplete="username"
                    name="username"
                    value={username}
                    onChange={changeUsername}
                  />
                </fieldset>

                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
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
                    autoComplete="new-password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={changePassword}
                  />
                </fieldset>

                <button
                  className="btn btn-lg btn-primary pull-xs-right"
                  type="submit"
                  disabled={inProgress}
                >
                  Sign up
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
