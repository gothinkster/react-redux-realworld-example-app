import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';

import ListErrors from './ListErrors';
import { login, loginPageUnloaded } from '../reducers/auth';

const mapStateToProps = state => state.auth;

const mapDispatchToProps = dispatch => ({
  onSubmit: (email, password) => dispatch(login({ email, password })),
  onUnload: () => dispatch(loginPageUnloaded()),
});

class Login extends React.PureComponent {
  state = {
    email: '',
    password: '',
  };

  componentWillUnmount() {
    this.props.onUnload();
  }

  changeEmail = event => {
    this.setState({ email: event.target.value });
  };

  changePassword = event => {
    this.setState({ password: event.target.value });
  };

  submitForm = event => {
    event.preventDefault();
    this.props.onSubmit(this.state.email, this.state.password);
  };

  render() {
    return (
      <div className='auth-page'>
        <div className='container page'>
          <div className='row'>

            <div className='col-md-6 offset-md-3 col-xs-12'>
              <h1 className='text-xs-center'>Sign In</h1>
              <p className='text-xs-center'>
                <Link to='/register'>
                  Need an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm}>
                <fieldset>

                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      autoComplete='username'
                      type='email'
                      name='email'
                      placeholder='Email'
                      autoComplete='email'
                      value={this.state.email}
                      onChange={this.changeEmail}
                    />
                  </fieldset>

                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      type='password'
                      name='password'
                      placeholder='Password'
                      autoComplete='current-password'
                      value={this.state.password}
                      onChange={this.changePassword}
                    />
                  </fieldset>

                  <button
                    className='btn btn-lg btn-primary pull-xs-right'
                    type='submit'
                    disabled={this.props.inProgress}>
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
