'use strict';

import Profile from './Profile';
import React from 'react';
import { Link } from 'react-router';
import agent from '../agent';
import store from '../store';

class ProfileFavorites extends Profile {
  componentWillMount() {
    store.dispatch({
      type: 'PROFILE_FAVORITES_PAGE_LOADED',
      payload: Promise.all([
        agent.Profile.get(this.props.params.username),
        agent.Articles.favoritedBy(this.props.params.username)
      ])
    });
  }

  componentWillUnmount() {
    store.dispatch({ type: 'PROFILE_FAVORITES_PAGE_UNLOADED' });
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className="nav-link"
            to={`@${this.state.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`@${this.state.profile.username}/favorites`}>
            Favorited Articles
          </Link>
        </li>
      </ul>
    );
  }
}

export default ProfileFavorites;
