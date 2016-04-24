'use strict';

const React = require('react');
const Router = require('react-router');
const store = require('../store');

const LoggedOutView = props => {
  if (!props.state.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Router.Link to="/" className="nav-link">
            Home
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link to="login" className="nav-link">
            Sign in
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link to="register" className="nav-link">
            Sign up
          </Router.Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.state.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Router.Link to="" className="nav-link">
            Home
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link to="editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link to="settings" className="nav-link">
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link
            to={`@${props.state.currentUser.username}`}
            className="nav-link">
            <img src={props.state.currentUser.image} className="user-pic" />
            {props.state.currentUser.username}
          </Router.Link>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Router.Link to="/" className="navbar-brand">
            {this.props.state.appName.toLowerCase()}
          </Router.Link>


          <LoggedOutView state={this.props.state} />

          <LoggedInView state={this.props.state} />
        </div>
      </nav>
    );
  }
}

module.exports = Header;
