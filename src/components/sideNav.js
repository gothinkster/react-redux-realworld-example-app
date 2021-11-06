import React from 'react';
import SideNav from 'react-simple-sidenav';
import { Link } from 'react-router-dom';
import '../components/styles.css';



const LoggedOutView = props => {
    if (!props.currentUser) {
      return (
        <ul className="nav side_item" onClick={props.onClick}>
  
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
        <ul className="nav side_item">
          
  
          <li className="nav-item home_item">
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
  

const sideNav=(props)=>{

    console.log(props);
    return (<div>
       <SideNav showNav={props.showNav} onHideNav={props.onHideSideNav}>
       <Link to="/" className="navbar-brand">
            {props.appName.toLowerCase()}
          </Link>
          <LoggedOutView currentUser={props.currentUser}/>

          <LoggedInView currentUser={props.currentUser} />
       </SideNav>
    </div>)
}

export default sideNav;