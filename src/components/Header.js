import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = props => {
  if (!props.currentUser) {
    return (
      <ul className="nav navbar-nav pull-xs-right">

        <li className="nav-item">
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/login" className="nav-link">
            Sign in
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/register" className="nav-link">
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
          <Link to="/" className="nav-link">
            Home
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </li>

        <li className="nav-item">
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </li>

        <li className="nav-item">
          <Link
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
  constructor(props) {
    super(props);
    this.toggleMenu= this.toggleMenu.bind(this);
    this.state = {
        active: true,
    };
  }

  toggleMenu(){    
    this.setState(state => ({ active: !state.active }));
  }

  render() {
    return (
      <nav className="navbar navbar-light nav-conduit">
        <div className="container nav-responsive">

          <div className="hamburger">
            <button className="btn btn-sm btn-outline-primary" onClick={this.toggleMenu}>
              <i className="ion-android-menu"></i>
            </button>
          </div>

          <Link to="/" className="navbar-brand">
            {this.props.appName.toLowerCase()}
          </Link>

          <span className={this.state.active ? 'menu-hamburger' : 'menu-hamburger active'}>
            <LoggedOutView currentUser={this.props.currentUser} />

            <LoggedInView currentUser={this.props.currentUser} />
          </span>
        </div>
      </nav>
    );
  }
}

export default Header;
