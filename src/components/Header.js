'use strict';

import { Link } from 'react-router';
import React from 'react';

class Header extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-light">
        <div className="container">

          <Link to="/" className="navbar-brand">
            {this.props.appName.toLowerCase()}
          </Link>

          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-item">
              <Link to="login" className="nav-link">
                Sign in
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default Header;
