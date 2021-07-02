import React from 'react'
import { Link } from 'react-router-dom'

const LoggedOutView = React.memo(props => {
  if (!props.currentUser) {
    return (
      <ul className='nav navbar-nav pull-xs-right'>

        <li className='nav-item'>
          <Link to='/' className='nav-link'>
            Home
          </Link>
        </li>

        <li className='nav-item'>
          <Link to='/login' className='nav-link'>
            Sign in
          </Link>
        </li>

        <li className='nav-item'>
          <Link to='/register' className='nav-link'>
            Sign up
          </Link>
        </li>

      </ul>
    )
  }
  return null
})

const LoggedInView = React.memo(props => {
  if (props.currentUser) {
    return (
      <ul className='nav navbar-nav pull-xs-right'>

        <li className='nav-item'>
          <Link to='/' className='nav-link'>
            Home
          </Link>
        </li>

        <li className='nav-item'>
          <Link to='/editor' className='nav-link'>
            <i className='ion-compose' />&nbsp;New Post
          </Link>
        </li>

        <li className='nav-item'>
          <Link to='/settings' className='nav-link'>
            <i className='ion-gear-a' />&nbsp;Settings
          </Link>
        </li>

        <li className='nav-item'>
          <Link
            to={`/@${props.currentUser.username}`}
            className='nav-link'
          >
            <img src={props.currentUser.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} className='user-pic' alt={props.currentUser.username} />
            {props.currentUser.username}
          </Link>
        </li>

      </ul>
    )
  }

  return null
})

function Header (props) {
  return (
    <nav className='navbar navbar-light'>
      <div className='container'>

        <Link to='/' className='navbar-brand'>
          {props.appName.toLowerCase()}
        </Link>

        <LoggedOutView currentUser={props.currentUser} />

        <LoggedInView currentUser={props.currentUser} />
      </div>
    </nav>
  )
}

export default Header
