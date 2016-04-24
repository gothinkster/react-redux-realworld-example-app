'use strict';

const Profile = require('./Profile');
const React = require('react');
const Router = require('react-router');
const agent = require('../agent');
const store = require('../store');

class ProfileFavorites extends Profile {
  componentWillMount() {
    store.dispatch({
      type: 'PROFILE_PAGE_LOADED',
      payload: Promise.all([
        agent.Profile.get(this.props.params.username),
        agent.Articles.favoritedBy(this.props.params.username)
      ])
    });
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Router.Link
            className="nav-link"
            to={`@${this.state.profile.username}`}>
            My Articles
          </Router.Link>
        </li>

        <li className="nav-item">
          <Router.Link
            className="nav-link active"
            to={`@${this.state.profile.username}/favorites`}>
            Favorited Articles
          </Router.Link>
        </li>
      </ul>
    );
  }
}

module.exports = ProfileFavorites;
