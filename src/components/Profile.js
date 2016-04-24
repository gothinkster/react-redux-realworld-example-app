'use strict';

const ArticleList = require('./ArticleList');
const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

const EditProfileSettings = props => {
  if (props.isUser) {
    return (
      <Router.Link
        to="settings"
        className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Router.Link>
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

class Profile extends React.Component {
  constructor() {
    super();
    this.state = store.getState();
  }

  componentDidMount() {
    this.unsubscribe = store.subscribe(() => {
      this.setState(store.getState());
    });
  }

  componentWillMount() {
    store.dispatch({
      type: 'PROFILE_PAGE_LOADED',
      payload: Promise.all([
        agent.Profile.get(this.props.params.username),
        agent.Articles.byAuthor(this.props.params.username)
      ])
    });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
    store.dispatch({ type: 'PROFILE_PAGE_UNLOADED' });
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Router.Link
            className="nav-link active"
            to={`@${this.state.profile.username}`}>
            My Articles
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link
            className="nav-link"
            to={`@${this.state.profile.username}/favorites`}>
            Favorited Articles
          </Router.Link>
        </li>
      </ul>
    );
  }

  render() {
    const profile = this.state.profile;
    if (!this.state.profile) {
      return null;
    }

    const isUser = this.state.currentUser &&
      profile.username === this.state.currentUser.username;

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
                articles={this.state.articles}
                articlesCount={this.state.articlesCount}
                state={this.state.currentPage} />
            </div>

          </div>
        </div>

      </div>
    );
  }
}

module.exports = Profile;
