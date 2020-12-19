import { Link } from "react-router-dom"
import ListErrors from "./ListErrors"
import React from "react"
import agent from "../agent"
import { connect } from "react-redux"
import { UPDATE_FIELD_AUTH, REGISTER, REGISTER_PAGE_UNLOADED } from "../constants/actionTypes"

const mapStateToProps = (state: { auth: any }) => ({ ...state.auth })

const mapDispatchToProps = (
  dispatch: (arg0: { type: string; key?: string; value?: any; payload?: Promise<any> }) => void,
) => ({
  onChangeEmail: (value: any) => dispatch({ type: UPDATE_FIELD_AUTH, key: "email", value }),
  onChangePassword: (value: any) => dispatch({ type: UPDATE_FIELD_AUTH, key: "password", value }),
  onChangeUsername: (value: any) => dispatch({ type: UPDATE_FIELD_AUTH, key: "username", value }),
  onSubmit: (username: string, email: string, password: string) => {
    const payload = agent.Auth.register(username, email, password)
    dispatch({ type: REGISTER, payload })
  },
  onUnload: () => dispatch({ type: REGISTER_PAGE_UNLOADED }),
})

class Register extends React.Component<any> {
  changeEmail: (ev: { target: { value: any } }) => any
  changePassword: (ev: { target: { value: any } }) => any
  changeUsername: (ev: { target: { value: any } }) => any
  submitForm: (
    username: any,
    email: any,
    password: any,
  ) => (ev: { preventDefault: () => void }) => void
  constructor(props?: any) {
    super(props)
    this.changeEmail = (ev: { target: { value: any } }) => this.props.onChangeEmail(ev.target.value)
    this.changePassword = (ev: { target: { value: any } }) =>
      this.props.onChangePassword(ev.target.value)
    this.changeUsername = (ev: { target: { value: any } }) =>
      this.props.onChangeUsername(ev.target.value)
    this.submitForm = (username: any, email: any, password: any) => (ev: {
      preventDefault: () => void
    }) => {
      ev.preventDefault()
      this.props.onSubmit(username, email, password)
    }
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  render() {
    const email = this.props.email
    const password = this.props.password
    const username = this.props.username

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <ListErrors errors={this.props.errors} />

              <form onSubmit={this.submitForm(username, email, password)}>
                <fieldset>
                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="text"
                      placeholder="Username"
                      value={this.props.username}
                      onChange={this.changeUsername}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email"
                      value={this.props.email}
                      onChange={this.changeEmail}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password"
                      value={this.props.password}
                      onChange={this.changePassword}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.props.inProgress}
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Register)
