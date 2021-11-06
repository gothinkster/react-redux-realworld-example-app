import React, { useEffect } from 'react';
import { mapStateToProps } from './Profile';
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

const ProfileFavorites = ({ match, articleList, currentUser, profile, onFollow, onUnfollow, onLoad, onUnload }) => {
  const { pager, articles, articlesCount, currentPage } = articleList;

  useEffect(() => {
    onLoad(page => agent.Articles.favoritedBy(match.params.username, page), Promise.all([
      agent.Profile.get(match.params.username),
      agent.Articles.favoritedBy(match.params.username)
    ]));

    return () => onUnload();
  }, []);

  if (!profile) {
    return null;
  }

  return (
    <div className="profile-page">
      <UserInfo
        profile={profile}
        currentUser={currentUser}
        onFollow={onFollow}
        onUnfollow={onUnfollow}
      />

      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <div className="articles-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to={`/@${profile.username}`}>
                    My Articles
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link active"
                    to={`/@${profile.username}/favorites`}>
                    Favorited Articles
                  </Link>
                </li>
              </ul>

            </div>

            <ArticleList
              pager={pager}
              articles={articles}
              articlesCount={articlesCount}
              state={currentPage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ProfileFavorites);
