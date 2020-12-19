import { Link } from "react-router-dom"
import ListErrors from "./ListErrors"
import React from "react"
import agent from "../agent"
import { connect } from "react-redux"
import { UPDATE_FIELD_AUTH, LOGIN, LOGIN_PAGE_UNLOADED } from "../constants/actionTypes"

const mapStateToProps = (state: { auth: any }) => ({ ...state.auth })

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; key?: string; value?: any; payload?: Promise<any> }) => any,
) => ({
  onChangeEmail: (value: any) => dispatch({ type: UPDATE_FIELD_AUTH, key: "email", value }),
  onChangePassword: (value: any) => dispatch({ type: UPDATE_FIELD_AUTH, key: "password", value }),
  onSubmit: (email: string, password: string) =>
    dispatch({ type: LOGIN, payload: agent.Auth.login(email, password) }),
  onUnload: () => dispatch({ type: LOGIN_PAGE_UNLOADED }),
})

class Login extends React.Component<{
  onChangePassword: (value: any) => void
  onChangeEmail: (value: any) => void
  onSubmit: (email: string, password: string) => void
  onUnload: () => void
  email: string
  password: string
  inProgress: boolean
  errors?: any
}> {
  changeEmail: (ev: { target: { value: any } }) => any
  changePassword: (ev: { target: { value: any } }) => any
  submitForm: (email: string, password: string) => (ev: { preventDefault: () => void }) => void
  constructor(props?: any) {
    super(props)
    this.changeEmail = (ev: { target: { value: any } }) => this.props.onChangeEmail(ev.target.value)
    this.changePassword = (ev: { target: { value: any } }) =>
      this.props.onChangePassword(ev.target.value)
    this.submitForm = (email: any, password: any) => (ev: { preventDefault: () => void }) => {
      ev.preventDefault()
      this.props.onSubmit(email, password)
    }
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const email = this.props.email
    const password = this.props.password
    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <Link to="/register">Need an account?</Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(email, password)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={this.changeEmail}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={this.changePassword}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
