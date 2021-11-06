import React from 'react';
import { Link } from 'react-router-dom';

const LoggedOutView = ({ currentUser }) => {
  if (!currentUser) {
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

const LoggedInView = ({ currentUser }) => {
  if (currentUser) {
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
            to={`/@${currentUser.username}`}
            className="nav-link">
            <img src={currentUser.image} className="user-pic" alt={currentUser.username} />
            {currentUser.username}
          </Link>
        </li>

      </ul>
    );
  }

  return null;
};

const Header = ({ appName, currentUser }) => {
  return (
    <nav className="navbar navbar-light">
      <div className="container">

        <Link to="/" className="navbar-brand">
          {appName.toLowerCase()}
        </Link>

        <LoggedOutView currentUser={currentUser} />

        <LoggedInView currentUser={currentUser} />
      </div>
    </nav>
  );
};

export default Header;
