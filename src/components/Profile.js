import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import ArticleList from './ArticleList'
import {
  follow,
  unfollow,
  profilePageLoaded,
  profilePageUnloaded
} from '../reducers/profile'

const EditProfileSettings = React.memo(props => {
  if (props.isUser) {
    return (
      <Link
        to='/settings'
        className='btn btn-sm btn-outline-secondary action-btn'
      >
        <i className='ion-gear-a' /> Edit Profile Settings
      </Link>
    )
  }
  return null
})

const FollowUserButton = React.memo(props => {
  if (props.isUser) {
    return null
  }

  let classes = 'btn btn-sm action-btn'
  if (props.user.following) {
    classes += ' btn-secondary'
  } else {
    classes += ' btn-outline-secondary'
  }

  const handleClick = ev => {
    ev.preventDefault()
    if (props.user.following) {
      props.onUnfollow(props.user.username)
    } else {
      props.onFollow(props.user.username)
    }
  }

  return (
    <button
      className={classes}
      onClick={handleClick}
    >
      <i className='ion-plus-round' />
      &nbsp;
      {props.user.following ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  )
})

const mapStateToProps = state => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile
})

const mapDispatchToProps = dispatch => ({
  onFollow: username => dispatch(follow(username)),
  onLoad: username => dispatch(profilePageLoaded(username)),
  onUnfollow: username => dispatch(unfollow(username)),
  onUnload: () => dispatch(profilePageUnloaded())
})

function Profile (props) {
  useEffect(() => {
    props.onLoad(props.match.params.username)
    return () => {
      props.onUnload()
    }
  }, [])

  const renderTabs = () => {
    return (
      <ul className='nav nav-pills outline-active'>
        <li className='nav-item'>
          <Link
            className='nav-link active'
            to={`/@${props.profile.username}`}
          >
            My Articles
          </Link>
        </li>

        <li className='nav-item'>
          <Link
            className='nav-link'
            to={`/@${props.profile.username}/favorites`}
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    )
  }

  const profile = props.profile
  if (!profile) {
    return null
  }

  const isUser = props.currentUser &&
      props.profile.username === props.currentUser.username

  return (
    <div className='profile-page'>

      <div className='user-info'>
        <div className='container'>
          <div className='row'>
            <div className='col-xs-12 col-md-10 offset-md-1'>

              <img src={profile.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'} className='user-img' alt={profile.username} />
              <h4>{profile.username}</h4>
              <p>{profile.bio}</p>

              <EditProfileSettings isUser={isUser} />
              <FollowUserButton
                isUser={isUser}
                user={profile}
                onFollow={props.onFollow}
                onUnfollow={props.onUnfollow}
              />

            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='row'>

          <div className='col-xs-12 col-md-10 offset-md-1'>

            <div className='articles-toggle'>
              {renderTabs()}
            </div>

            <ArticleList
              pager={props.pager}
              articles={props.articles}
              articlesCount={props.articlesCount}
              state={props.currentPage}
            />
          </div>

        </div>
      </div>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
export { Profile, mapStateToProps }
