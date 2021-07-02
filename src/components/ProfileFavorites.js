import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { Profile, mapStateToProps } from './Profile';
import {
  profileFavoritesPageLoaded,
  profilePageUnloaded,
} from '../reducers/profile';

const mapDispatchToProps = dispatch => ({
  onLoad: username => dispatch(profileFavoritesPageLoaded(username)),
  onUnload: () => dispatch(profilePageUnloaded()),
});

class ProfileFavorites extends Profile {
  componentDidMount() {
    this.props.onLoad(this.props.match.params.username);
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
