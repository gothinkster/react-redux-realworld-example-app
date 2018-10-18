import { Link } from "react-router-dom";
import React from "react";
import agent from "../agent";
import update from "immutability-helper";

class Register extends React.Component {
  constructor() {
    super();

    this.state = {
      firstName: "",
      lastName: "",
      username: "",
      email: "",
      password: "",
      errors: {
        fullName: false,
        username: false,
        email: false,
        password: false
      },
      patterns: {
        firstName: /^\D+$/,
        lastName: /^\D+$/,
        username: /^\w{5,}$/,
        password: /^.{8,}$/,
        email: /^[\w.]+@\w+.\w+$/
      }
    };

    this.isDisabled = this.isDisabled.bind(this);

    this.submitForm = (username, email, password) => ev => {
      ev.preventDefault();
      agent.Auth.register(username, email, password);
    };

    this.updateFields = this.updateFields.bind(this);
  }

  updateFields(event) {
    const { errors, patterns } = this.state;
    let error;
    if (event.target.name === "fullName") {
      const nameArr = event.target.value.split(" ", 2);
      error =
        nameArr[0].match(patterns.firstName) === null ||
        typeof nameArr[1] === "undefined" ||
        !nameArr[1].match(patterns.lastName)
          ? true
          : false;
      this.setState({ firstName: nameArr[0], lastName: nameArr[1] || "" });
    } else {
      error =
        event.target.value.match(patterns[event.target.name]) === null
          ? true
          : false;
      this.setState({ [event.target.name]: event.target.value });
    }
    this.setState({
      errors: update(errors, { [event.target.name]: { $set: error } })
    });
  }

  checkForErrors() {
    const { errors } = this.state;
    for (var key in errors) {
      if (errors[key] === true) {
        return true;
      }
    }
    return false;
  }

  isDisabled() {
    const { firstName, lastName, username, email, password } = this.state;
    if (
      firstName.length === 0 ||
      lastName.length === 0 ||
      username.length === 0 ||
      email.length === 0 ||
      password.length === 0 ||
      this.checkForErrors() === true
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { email, password, username, errors, fullName } = this.state;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <form onSubmit={this.submitForm(username, email, password)}>
                <fieldset>
                  <fieldset className="form-group">
                    <label htmlFor="fullNameInput" className="form-group-label">
                      Full Name
                    </label>
                    {errors.fullName && (
                      <span className="error">
                        Must contain first and last name
                      </span>
                    )}
                    <input
                      id="fullNameInput"
                      className="form-control form-control-lg"
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={this.updateFields}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="usernameInput" className="form-group-label">
                      Username
                    </label>
                    {errors.username && (
                      <span className="error">
                        username must be at least five characters
                      </span>
                    )}
                    <input
                      id="usernameInput"
                      className="form-control form-control-lg"
                      name="username"
                      type="text"
                      value={username}
                      onChange={this.updateFields}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="form-group-label" htmlFor="email">
                      Email
                    </label>
                    {errors.email && (
                      <span className="error">
                        Make sure to enter a valid e-mail
                      </span>
                    )}
                    <input
                      id="emailInput"
                      name="email"
                      className="form-control form-control-lg"
                      type="email"
                      value={email}
                      onChange={this.updateFields}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="form-group-label" htmlFor="passwordInput">
                      Password
                    </label>
                    {errors.password && (
                      <span className="error">
                        Password must be at least eight characters
                      </span>
                    )}
                    <input
                      id="passwordInput"
                      name="password"
                      className="form-control form-control-lg"
                      type="password"
                      value={password}
                      onChange={this.updateFields}
                    />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.isDisabled()}
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
}

export default Register;
