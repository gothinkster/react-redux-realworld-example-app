import { Link } from 'react-router-dom';
import React from 'react';
import { connect } from 'react-redux';

import ListErrors from './ListErrors';
import { register, registerPageUnloaded } from '../reducers/auth';

const mapStateToProps = state => ({ ...state.auth });

const mapDispatchToProps = dispatch => ({
  onSubmit: (username, email, password) =>
    dispatch(register({ username, email, password })),
  onUnload: () => dispatch(registerPageUnloaded()),
});

class Register extends React.PureComponent {
  state = {
    username: '',
    email: '',
    password: '',
  };

  componentWillUnmount() {
    this.props.onUnload();
    }

  changeUsername = event => this.setState({ username: event.target.value });

  changeEmail = event => this.setState({ email: event.target.value });

  changePassword = event => this.setState({ password: event.target.value });

  submitForm = event => {
    event.preventDefault();
    this.props.onSubmit(
      this.state.username,
      this.state.email,
      this.state.password
    );
  };

  render() {
    return (
      <div className='auth-page'>
        <div className='container page'>
          <div className='row'>

            <div className='col-md-6 offset-md-3 col-xs-12'>
              <h1 className='text-xs-center'>Sign Up</h1>
              <p className='text-xs-center'>
                <Link to='/login'>
                  Have an account?
                </Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm}>
                <fieldset>

                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      type='text'
                      placeholder='Username'
                      autoComplete='username'
                      name='username'
                      value={this.state.username}
                      onChange={this.changeUsername}
                    />
                  </fieldset>

                  <fieldset className='form-group'>
                    <input
                      className='form-control form-control-lg'
                      type='email'
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
                      autoComplete='new-password'
                      placeholder='Password'
                      name='password'
                      value={this.state.password}
                      onChange={this.changePassword}
                    />
                  </fieldset>

                  <button
                    className='btn btn-lg btn-primary pull-xs-right'
                    type='submit'
                    disabled={this.props.inProgress}>
                    Sign up
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

export default connect(mapStateToProps, mapDispatchToProps)(Register)
