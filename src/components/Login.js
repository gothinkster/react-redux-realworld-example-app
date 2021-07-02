import { Link } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'

import ListErrors from './ListErrors'
import { login, loginPageUnloaded } from '../reducers/auth'

const mapStateToProps = state => state.auth

const mapDispatchToProps = dispatch => ({
  onSubmit: (email, password) => dispatch(login({ email, password })),
  onUnload: () => dispatch(loginPageUnloaded())
})

function Login (props) {
  const [email, setEmail] = useState('')
  const [password, setPassWord] = useState('')

  useEffect(() => {
    return () => {
      props.onUnload()
    }
  }, [])

  const changeEmail = event => {
    setEmail(event.target.value)
  }

  const changePassword = event => {
    setPassWord(event.target.value)
  }

  const submitForm = event => {
    event.preventDefault()
    props.onSubmit(email, password)
  }

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

            <ListErrors errors={props.errors} />

            <form onSubmit={submitForm}>
              <fieldset>

                <fieldset className='form-group'>
                  <input
                    className='form-control form-control-lg'
                    type='email'
                    name='email'
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
                    name='password'
                    placeholder='Password'
                    autoComplete='current-password'
                    value={password}
                    onChange={changePassword}
                  />
                </fieldset>

                <button
                  className='btn btn-lg btn-primary pull-xs-right'
                  type='submit'
                  disabled={props.inProgress}
                >
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

export default connect(mapStateToProps, mapDispatchToProps)(Login)
