import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Profile, mapStateToProps } from './Profile';
import agent from '../agent';
import { PROFILE_PAGE_LOADED } from '../constants/actionTypes';
import { profilePageUnloaded } from '../reducers/profile';

const mapDispatchToProps = dispatch => ({
  onLoad: (pager, payload) =>
    dispatch({ type: PROFILE_PAGE_LOADED, pager, payload }),
  onUnload: () => dispatch(profilePageUnloaded()),
});

class ProfileFavorites extends Profile {
  componentDidMount() {
    this.props.onLoad(page => agent.Articles.favoritedBy(this.props.match.params.username, page), Promise.all([
      agent.Profile.get(this.props.match.params.username),
      agent.Articles.favoritedBy(this.props.match.params.username)
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
            className="nav-link"
            to={`/@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className="nav-link active"
            to={`/@${this.props.profile.username}/favorites`}>
            Favorited Articles
          </Link>
        </li>
      </ul>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFavorites);
