import React from 'react';
import { Link } from 'react-router-dom';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="/settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    );
  }
  return null;
};


const FollowUserButton = props => {
  if (props.isUser) {
    return null;
  }

  let classes = 'btn btn-sm action-btn';
  if (props.user.following) {
    classes += ' btn-secondary';
  } else {
    classes += ' btn-outline-secondary';
  }

  const handleClick = ev => {
    ev.preventDefault();
    if (props.user.following) {
      props.unfollow(props.user.username)
    } else {
      props.follow(props.user.username)
    }
  };

  return (
    <button
      className={classes}
      onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.following ? 'Unfollow' : 'Follow'} {props.user.username}
    </button>
  );
};

const UserInfo = ({profile, currentUser, onFollow, onUnfollow}) => {
  const isUser = currentUser && profile.username === currentUser.username;

  return <div className="user-info">
    <div className="container">
      <div className="row">
        <div className="col-xs-12 col-md-10 offset-md-1">

          <img src={profile.image} className="user-img" alt={profile.username} />
          <h4>{profile.username}</h4>
          <p>{profile.bio}</p>

          <EditProfileSettings isUser={isUser} />
          <FollowUserButton
            isUser={isUser}
            user={profile}
            follow={onFollow}
            unfollow={onUnfollow}
            />

        </div>
      </div>
    </div>
  </div>
}
export default UserInfo;