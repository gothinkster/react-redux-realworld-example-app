import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import ListErrors from './ListErrors'
import { logout } from '../reducers/common'
import { saveSettings, settingsPageUnloaded } from '../reducers/settings'

function SettingsForm (props) {
  const { currentUser } = props
  const [state, setState] = useState({
    image:
        currentUser?.image ??
        'https://static.productionready.io/images/smiley-cyrus.jpg',
    username: currentUser?.username ?? '',
    bio: currentUser?.bio ?? '',
    email: currentUser?.email ?? '',
    password: currentUser?.password ?? ''
  })

  const updateState = event => {
    setState(oldState => ({
      ...oldState,
      [event.target.name]: event.target.value
    }))
  }

  const submitForm = event => {
    event.preventDefault()

    const user = Object.assign({}, state)
    if (!user.password) {
      delete user.password
    }

    props.onSubmitForm(user)
  }

  const { image, username, bio, email } = state

  return (
    <form onSubmit={submitForm}>
      <fieldset>

        <fieldset className='form-group'>
          <input
            className='form-control'
            type='text'
            placeholder='URL of profile picture'
            name='image'
            value={image}
            onChange={updateState}
          />
        </fieldset>

        <fieldset className='form-group'>
          <input
            className='form-control form-control-lg'
            type='text'
            placeholder='Username'
            name='username'
            value={username}
            onChange={updateState}
          />
        </fieldset>

        <fieldset className='form-group'>
          <textarea
            className='form-control form-control-lg'
            rows='8'
            placeholder='Short bio about you'
            name='bio'
            value={bio}
            onChange={updateState}
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
            onChange={updateState}
          />
        </fieldset>

        <fieldset className='form-group'>
          <input
            className='form-control form-control-lg'
            type='password'
            autoComplete='current-password'
            placeholder='New Password'
            name='password'
            value={state.password}
            onChange={updateState}
          />
        </fieldset>

        <button
          className='btn btn-lg btn-primary pull-xs-right'
          type='submit'
          disabled={state.inProgress}
        >
          Update Settings
        </button>

      </fieldset>
    </form>
  )
}

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser
})

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch(logout()),
  onSubmitForm: user => dispatch(saveSettings(user)),
  onUnload: () => dispatch(settingsPageUnloaded())
})

function Settings (props) {
  return (
    <div className='settings-page'>
      <div className='container page'>
        <div className='row'>
          <div className='col-md-6 offset-md-3 col-xs-12'>

            <h1 className='text-xs-center'>Your Settings</h1>

            <ListErrors errors={props.errors} />

            <SettingsForm
              currentUser={props.currentUser}
              onSubmitForm={props.onSubmitForm}
            />

            <hr />

            <button
              className='btn btn-outline-danger'
              onClick={props.onClickLogout}
            >
              Or click here to logout.
            </button>

          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings)
