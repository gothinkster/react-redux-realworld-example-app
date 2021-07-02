import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'

import ListErrors from './ListErrors'
import { register, registerPageUnloaded } from '../reducers/auth'

const mapStateToProps = state => ({ ...state.auth })

const mapDispatchToProps = dispatch => ({
  onSubmit: (username, email, password) =>
    dispatch(register({ username, email, password })),
  onUnload: () => dispatch(registerPageUnloaded())
})

function Register (props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    return () => {
      props.onUnload()
    }
  }, [])

  const changeUsername = event => setUsername(event.target.value)

  const changeEmail = event => setEmail(event.target.value)

  const changePassword = event => setPassword(event.target.value)

  const submitForm = event => {
    event.preventDefault()
    props.onSubmit(
      username,
      email,
      password
    )
  }

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

            <ListErrors errors={props.errors} />

            <form onSubmit={submitForm}>
              <fieldset>

                <fieldset className='form-group'>
                  <input
                    className='form-control form-control-lg'
                    type='text'
                    placeholder='Username'
                    autoComplete='username'
                    name='username'
                    value={username}
                    onChange={changeUsername}
                  />
                </fieldset>

                <fieldset className='form-group'>
                  <input
                    className='form-control form-control-lg'
                    type='email'
                    placeholder='Email'
                    autoComplete='email'
                    value={email}
                    onChange={changeEmail}
                  />
                </fieldset>

                <fieldset className='form-group'>
                  <input
                    className='form-control form-control-lg'
                    type='password'
                    autoComplete='new-password'
                    placeholder='Password'
                    name='password'
                    value={password}
                    onChange={changePassword}
                  />
                </fieldset>

                <button
                  className='btn btn-lg btn-primary pull-xs-right'
                  type='submit'
                  disabled={props.inProgress}
                >
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

export default connect(mapStateToProps, mapDispatchToProps)(Register)
