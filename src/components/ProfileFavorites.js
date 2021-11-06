import { mapStateToProps } from './Profile';
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../constants/actionTypes';
import ArticleList from './ArticleList';
import UserInfo from './UserInfo';

const mapDispatchToProps = dispatch => ({
  onLoad: (pager, payload) =>
    dispatch({ type: PROFILE_PAGE_LOADED, pager, payload }),
  onUnload: () =>
    dispatch({ type: PROFILE_PAGE_UNLOADED })
});

const ProfileFavorites = props => {
  const {profile} = props;

  useEffect(() => {
    props.onLoad(page => agent.Articles.favoritedBy(props.match.params.username, page), Promise.all([
      agent.Profile.get(props.match.params.username),
      agent.Articles.favoritedBy(props.match.params.username)
    ]));
    return () => props.onUnload();
  }, []);

  if (!profile) {return null;}

  return (
    <div className="profile-page">
      <UserInfo
        profile={profile}
        currentUser={props.currentUser}
        onFollow={props.onFollow}
        onUnfollow={props.onUnfollow}
      />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/@${props.profile.username}`}>
                    My Articles
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to={`/@${props.profile.username}/favorites`}>
                    Favorited Articles
                  </Link>
                </li>
              </ul>

            </div>

            <ArticleList
              pager={props.pager}
              articles={props.articles}
              articlesCount={props.articlesCount}
              state={props.currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFavorites);
