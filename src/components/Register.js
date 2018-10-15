import { Link } from 'react-router-dom';
import React from 'react';
import agent from '../agent';
import update from 'immutability-helper';

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
        password:  false
      },
      patterns: {
        firstName: /^\D+$/,
        lastName: /^\D+$/,
        username: /^\D{5,}$/,
        password: /^\D{8,}$/,
        email: /^\D+@\D\.\D+$/
      }      
    };

    this.isDisabled = this.isDisabled.bind(this);

    this.submitForm = (username, email, password) => ev => {
      ev.preventDefault();
      agent.Auth.register(username, email, password);
    }

    this.changeFullName = this.changeFullName.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeUsername = this.changeUsername.bind(this);
    this.changePassword = this.changePassword.bind(this);
    this.checkForErrors = this.checkForErrors.bind(this);
  }

  changeFullName(event) {
    const {errors, patterns} = this.state;
    const nameArr = event.target.value.split(" ", 2);
    const error = nameArr[0].match(patterns.firstName) === null || typeof nameArr[1] === "undefined" || !nameArr[1].match(patterns.lastName) ? true : false;
    this.setState({errors: update(errors, {fullName: {$set: error}})});
    this.setState({firstName: nameArr[0], lastName: nameArr[1] || ""});
  }

  changeEmail(event) {
    const {errors, patterns} = this.state;
    const error = event.target.value.match(patterns.email) === null ? true : false;
    this.setState({errors: update(errors, {email: {$set: error}})});
    this.setState({email: event.target.value});
  }

  changePassword(event) {
    const {errors, patterns} = this.state;
    const error = event.target.value.match(patterns.password) === null ? true : false;
    console.log(error);
    this.setState({errors: update(errors, {password: {$set: error}})});     
    this.setState({password: event.target.value})
  }

  changeUsername(event) {
    const {errors, patterns} = this.state;
    const error = event.target.value.match(patterns.username) === null ? true : false;
    this.setState({errors: update(errors, {username: {$set: error}})});
    this.setState({username: event.target.value});
  }

  checkForErrors() {
    const {errors} = this.state;
    for(var key in errors) {
      if (errors[key] === true) {        
        return true;
      }
    }
    return false;
  }

  isDisabled() {
    const {firstName, lastName, username, email, password } = this.state;
    if (firstName.length === 0 || lastName.length === 0 || username.length === 0 || email.length === 0 || password.length === 0 || this.checkForErrors() === true) {
      return true;
    }
    return false;
  }

  render() {
    const {email, password, username, errors, fullName} = this.state;    

    return (

      <div className="auth-page">
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign Up</h1>
              <p className="text-xs-center">
                <Link to="/login">
                  Have an account?
                </Link>
              </p>

              <form onSubmit={this.submitForm(username, email, password)}>
                <fieldset>

                  <fieldset className="form-group">
                  <label htmlFor="fullNameInput" className="form-group-label">Full Name</label>
                  {errors.fullName && <span className="error">Must contain first and last name</span>}
                    <input
                      id="fullNameInput"
                      className="form-control form-control-lg"
                      type="text"
                      value={fullName}
                      onChange={this.changeFullName} />
                  </fieldset>

                  <fieldset className="form-group">
                    <label htmlFor="usernameInput" className="form-group-label">Username</label>                  
                    {errors.username && <span className="error">username must be at least five characters</span>}                  
                    <input
                      id="usernameInput"
                      className="form-control form-control-lg"
                      type="text"
                      value={username}
                      onChange={this.changeUsername} />
                  </fieldset>

                  <fieldset className="form-group">
                  <label className="form-group-label" htmlFor="emailInput">Email</label>
                  {errors.email && <span className="error">Make sure to enter a valid e-mail</span>}                  
                    <input
                    id="emailInput"
                      className="form-control form-control-lg"
                      type="email"
                      value={email}
                      onChange={this.changeEmail} />
                  </fieldset>

                  <fieldset className="form-group">
                  <label className="form-group-label" htmlFor="passwordInput">Password</label>  
                  {errors.password && <span className="error">Password must be at least eight characters</span>}                                                    
                    <input
                      id="passwordInput"
                      className="form-control form-control-lg"
                      type="password"
                      value={password}
                      onChange={this.changePassword} />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.isDisabled()}>
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
