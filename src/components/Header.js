import "bootstrap/dist/css/bootstrap.min.css";
import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem
} from 'reactstrap';
//Styles
//import "../node_modules/jquery/dist/jquery.min.js";
//import "../node_modules/assets/vendor/bootstrap/css/bootstrap.min.css";

const LoggedOutView = props => {
  if (!props.currentUser) {

     //Track state changed.
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
      <div>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
              <Link to="/" className="nav-link">Home</Link>
          </NavItem>
          <NavItem>
            <Link to="/login" className="nav-link">Sign in</Link>
          </NavItem>
          <NavItem>
            <Link to="/register" className="nav-link"> Sign up</Link>
          </NavItem>
        </Nav>
      </Collapse>
      </div>   
    );
  }
  return null;
};

const LoggedInView = props => {

  if (props.currentUser) {

    //Track state changed
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => setIsOpen(!isOpen);

    return (
      <div>
      <NavbarToggler onClick={toggle} />
      <Collapse isOpen={isOpen} navbar>
      <Nav className="ml-auto" navbar>
      <NavItem>
          <Link to="/" className="nav-link">
            Home
          </Link>
        </NavItem>

        <NavItem>
          <Link to="/editor" className="nav-link">
            <i className="ion-compose"></i>&nbsp;New Post
          </Link>
        </NavItem>

        <NavItem>
          <Link to="/settings" className="nav-link">
            <i className="ion-gear-a"></i>&nbsp;Settings
          </Link>
        </NavItem>

        <NavItem>
          <Link
            to={`/@${props.currentUser.username}`}
            className="nav-link">
            <img src={props.currentUser.image} className="user-pic" alt={props.currentUser.username} />
            {props.currentUser.username}
          </Link>
        </NavItem>
      </Nav>
        </Collapse>
      </div>
    );
  }

  return null;
};

class Header extends React.Component {
  render() {
    return (
      <div>
      <Navbar className="navbar navbar-expand-lg navbar-light">
      <div className="container">
        <NavbarBrand href="/" className="navbar-brand">
          {this.props.appName.toLowerCase()}
        </NavbarBrand>
        <LoggedOutView currentUser={this.props.currentUser} />
        <LoggedInView currentUser={this.props.currentUser} />
        </div>
      </Navbar>
    </div>
    );
  }
}

export default Header;
