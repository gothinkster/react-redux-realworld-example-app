'use strict';

import ArticleList from './ArticleList';
import React from 'react';
import { Link } from 'react-router';
import agent from '../agent';
import { connect } from 'react-redux';

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Link
        to="settings"
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
      store.dispatch({
        type: 'UNFOLLOW_USER',
        payload: agent.Profile.unfollow(props.user.username)
      });
    } else {
      store.dispatch({
        type: 'FOLLOW_USER',
        payload: agent.Profile.follow(props.user.username)
      });
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

const mapStateToProps = state => ({
  articles: state.articles,
  articlesCount: state.articlesCount,
  currentPage: state.currentPage,
  currentUser: state.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  onLoad: payload =>
    dispatch({ type: 'PROFILE_PAGE_LOADED', payload }),
  onUnload: () => dispatch({ type: 'PROFILE_PAGE_UNLOADED' })
});

class Profile extends React.Component {
  componentWillMount() {
    this.props.onLoad(Promise.all([
      agent.Profile.get(this.props.params.username),
      agent.Articles.byAuthor(this.props.params.username)
    ]));
  }

  componentWillUnmount() {
    this.props.onUnload();
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link"
            to={`@${this.props.profile.username}/favorites`}>
            Favorited Articles
          </Link>
        </li>
      </ul>
    );
  }

  render() {
    console.log('XX render', this.props.profile);
    const profile = this.props.profile;
    if (!profile) {
      return null;
    }

    const isUser = this.props.currentUser &&
      this.props.profile.username === this.props.currentUser.username;

    return (
      <div className="profile-page">

        <div className="user-info">
          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">

                <img src={profile.image} className="user-img" />
                <h4>{profile.username}</h4>
                <p>{profile.bio}</p>

                <EditProfileSettings isUser={isUser} />
                <FollowUserButton isUser={isUser} user={profile} />

              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">

            <div className="col-xs-12 col-md-10 offset-md-1">

              <div className="articles-toggle">
                {this.renderTabs()}
              </div>

              <ArticleList
                articles={this.props.articles}
                articlesCount={this.props.articlesCount}
                state={this.props.currentPage} />
            </div>

          </div>
        </div>

      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile as Profile, mapStateToProps as mapStateToProps };
