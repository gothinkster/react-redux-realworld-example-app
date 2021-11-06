import React from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from 'react-hamburger-menu'
import '../css/styles.css'

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={() => props.handleClick()}>
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link" onClick={() => props.handleClick()}>
            Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link" onClick={() => props.handleClick()}>
            Sign up
          </Link>
        </li>

      </ul>
    );
  }
  return null;
};

const LoggedInView = props => {
  if (props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link" onClick={() => props.handleClick()}>
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/editor" className="nav-link" onClick={() => props.handleClick()}>
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/settings" className="nav-link" onClick={() => props.handleClick()}>
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>

        <li className="nav-item">
          <Link
            onClick={() => props.handleClick()}
            to={`/@${props.currentUser.username}`}
            className="nav-link">
            <img src={props.currentUser.image} className="user-pic" alt={props.currentUser.username} />
            {props.currentUser.username}
          </Link>
        </li>

      </ul>
    );
  }

  return null;
};

class Header extends React.Component {
  constructor() {
    super();
    this.state = {
      open: false
    }
  }

  handleClick() {
    this.setState({
      open: !this.state.open
    });
  }

  render() {
    let dropDownClass;
    this.state.open ? dropDownClass = "" : dropDownClass = "hide"
    return (
      <nav className="navbar navbar-light">
        <div className="container topnav">

          <HamburgerMenu
            isOpen={this.state.open}
            menuClicked={this.handleClick.bind(this)}
            width={18}
            height={15}
            strokeWidth={1}
            animationDuration={0.5}
            className="hamburger"
          />
          <Link to="/" className="navbar-brand">
            {this.props.appName.toLowerCase()}
          </Link>
          <div className={"my-nav " + dropDownClass}>
            <LoggedOutView currentUser={this.props.currentUser} handleClick={this.handleClick} />

            <LoggedInView currentUser={this.props.currentUser} handleClick={this.handleClick} />
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
