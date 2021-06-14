import React from 'react';
import { connect } from 'react-redux';

import ListErrors from './ListErrors';
import { logout } from '../reducers/common';
import { saveSettings, settingsPageUnloaded } from '../reducers/settings';

class SettingsForm extends React.PureComponent {
  constructor(props) {
    super(props);
    const { currentUser } = props;
    this.state = {
      image:
        currentUser?.image ??
        'https://static.productionready.io/images/smiley-cyrus.jpg',
      username: currentUser?.username ?? '',
      bio: currentUser?.bio ?? '',
      email: currentUser?.email ?? '',
      password: currentUser?.password ?? '',
    };
  }

  updateState = event => {
    this.setState(oldState => ({
      ...oldState,
      [event.target.name]: event.target.value,
    }));
  };

  submitForm = event => {
    event.preventDefault();

    const user = Object.assign({}, this.state);
      if (!user.password) {
      delete user.password;
      }

    this.props.onSubmitForm(user);
  };

  render () {
    const { image, username, bio, email } = this.state

    return (
      <form onSubmit={this.submitForm}>
        <fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control'
              type='text'
              placeholder='URL of profile picture'
              name='image'
              value={image}
              onChange={this.updateState}
            />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='text'
              placeholder='Username'
              name='username'
              value={username}
              onChange={this.updateState}
            />
          </fieldset>

          <fieldset className='form-group'>
            <textarea
              className='form-control form-control-lg'
              rows='8'
              placeholder='Short bio about you'
              name='bio'
              value={bio}
              onChange={this.updateState}
            />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              autoComplete='username'
              type='email'
              placeholder='Email'
              name='email'
              value={email}
              onChange={this.updateState}
            />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='password'
              autoComplete='current-password'
              placeholder='New Password'
              name='password'
              value={this.state.password}
              onChange={this.updateState}
            />
          </fieldset>

          <button
            className='btn btn-lg btn-primary pull-xs-right'
            type='submit'
            disabled={this.state.inProgress}
          >
            Update Settings
          </button>

        </fieldset>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch(logout()),
  onSubmitForm: user => dispatch(saveSettings(user)),
  onUnload: () => dispatch(settingsPageUnloaded()),
});

class Settings extends React.PureComponent {
  render () {
    return (
      <div className='settings-page'>
        <div className='container page'>
          <div className='row'>
            <div className='col-md-6 offset-md-3 col-xs-12'>

              <h1 className='text-xs-center'>Your Settings</h1>

              <ListErrors errors={this.props.errors} />

              <SettingsForm
                currentUser={this.props.currentUser}
                onSubmitForm={this.props.onSubmitForm}
              />

              <hr />

              <button
                className='btn btn-outline-danger'
                onClick={this.props.onClickLogout}
              >
                Or click here to logout.
              </button>

            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
