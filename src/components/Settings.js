import ListErrors from './ListErrors'
import React from 'react'
import agent from '../agent'
import { connect } from 'react-redux'
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  LOGOUT
} from '../constants/actionTypes'

class SettingsForm extends React.PureComponent {
  constructor (props) {
    super(props)
    const { currentUser } = props
    this.state = {
      image: (currentUser && currentUser.image) || '',
      username: (currentUser && currentUser.username) || '',
      bio: (currentUser && currentUser.bio) || '',
      email: (currentUser && currentUser.email) || '',
      password: (currentUser && currentUser.password) || ''
    }

    this.updateState = field => ev => {
      const state = this.state
      const newState = Object.assign({}, state, { [field]: ev.target.value })
      this.setState(newState)
    }

    this.submitForm = ev => {
      ev.preventDefault()

      const user = Object.assign({}, this.state)
      if (!user.password) {
        delete user.password
      }

      this.props.onSubmitForm(user)
    }
  }

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
              value={image || ''}
              onChange={this.updateState('image')} />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='text'
              placeholder='Username'
              value={username || ''}
              onChange={this.updateState('username')} />
          </fieldset>

          <fieldset className='form-group'>
            <textarea
              className='form-control form-control-lg'
              rows='8'
              placeholder='Short bio about you'
              value={bio || ''}
              onChange={this.updateState('bio')} />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              autoComplete='username'
              type='email'
              placeholder='Email'
              value={email || ''}
              onChange={this.updateState('email')} />
          </fieldset>

          <fieldset className='form-group'>
            <input
              className='form-control form-control-lg'
              type='password'
              autoComplete='current-password'
              placeholder='New Password'
              value={this.state.password}
              onChange={this.updateState('password')} />
          </fieldset>

          <button
            className='btn btn-lg btn-primary pull-xs-right'
            type='submit'
            disabled={this.state.inProgress}>
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
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onSubmitForm: user =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
})

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
                onSubmitForm={this.props.onSubmitForm} />

              <hr />

              <button
                className='btn btn-outline-danger'
                onClick={this.props.onClickLogout}>
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
