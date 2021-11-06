import { Link } from "react-router-dom";
import React from "react";
import patterns from "../helpers/patterns";
import { registerUser } from "../services/auth";

class Register extends React.Component {
  constructor() {
    super();

    this.state = {
      fields: {
        firstName: "",
        lastName: "",
        fullName: "",
        username: "",
        email: "",
        password: ""
      }
    };

    this.initialState = this.state;

    this.isDisabled = this.isDisabled.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.updateField = this.updateField.bind(this);
    this.isInvalidField = this.isInvalidField.bind(this);
    this.updateNameField = this.updateNameField.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  async submitForm(event) {
    event.preventDefault();

    const {
      fields: { firstName, lastName, username, email, password }
    } = this.state;

    const msg = await registerUser({
      username,
      email,
      firstName,
      lastName,
      password
    }).then(
      result => {
        return result.success === true
          ? "Success!"
          : "That user already exists";
      },
      error => {
        return `Please contact an administrator - ${error}`;
      }
    );

    alert(msg);

    this.setState(this.initialState);
  }

  isInvalidField(key) {
    const { fields } = this.state;
    const pattern = patterns[`${key}Pattern`];
    if (fields[key].length > 0) {
      return !pattern.test(fields[key]);
    }
    return false;
  }

  updateNameField(event) {
    const { value } = event.target;
    const nameArr = value.split(" ", 2);
    this.setState(prevState => ({
      fields: {
        ...prevState.fields,
        fullName: value,
        firstName: nameArr[0],
        lastName: nameArr[1] || ""
      }
    }));
  }

  updateField(event) {
    const { name, value } = event.target;
    this.setState(prevState => ({
      fields: { ...prevState.fields, [name]: value }
    }));
  }

  isDisabled() {
    const { fields } = this.state;
    let bool = false;
    for (var key in fields) {
      if (fields[key].length === 0 || this.isInvalidField(key)) {
        bool = true;
      }
    }
    return bool;
  }

  render() {
    const {
      fields: { fullName, email, password, username }
    } = this.state;

    return (
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">Have an account?</Link>
              </p>

              <form onSubmit={event => this.submitForm(event)}>
                <fieldset>
                  <fieldset className="form-group">
                    <label htmlFor="fullNameInput" className="form-group-label">
                      Full Name
                    </label>
                    {this.isInvalidField("fullName") && (
                      <span className="error float-right">
                        Must contain first and last name
                      </span>
                    )}
                    <input
                      id="fullNameInput"
                      className="form-control form-control-lg"
                      type="text"
                      name="fullName"
                      value={fullName}
                      onChange={event => this.updateNameField(event)}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="usernameInput" className="form-group-label">
                      Username
                    </label>
                    {this.isInvalidField("username") && (
                      <span className="error float-right">
                        username must be at least five characters
                      </span>
                    )}
                    <input
                      id="usernameInput"
                      className="form-control form-control-lg"
                      name="username"
                      type="text"
                      value={username}
                      onChange={this.updateField}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="form-group-label" htmlFor="email">
                      Email
                    </label>
                    {this.isInvalidField("email") && (
                      <span className="error float-right">
                        Make sure to enter a valid e-mail
                      </span>
                    )}
                    <input
                      id="emailInput"
                      name="email"
                      className="form-control form-control-lg"
                      type="email"
                      value={email}
                      onChange={this.updateField}
                    />
                  </fieldset>

                  <fieldset className="form-group">
                    <label className="form-group-label" htmlFor="passwordInput">
                      Password
                    </label>
                    {this.isInvalidField("password") && (
                      <span className="error float-right">
                        Password must be at least eight characters
                      </span>
                    )}
                    <input
                      id="passwordInput"
                      name="password"
                      className="form-control form-control-lg"
                      type="password"
                      value={password}
                      onChange={this.updateField}
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
