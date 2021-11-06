import ArticleList from './ArticleList';
import UserInfo from './UserInfo';
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED
} from '../constants/actionTypes';

const mapStateToProps = state => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile
});

const mapDispatchToProps = dispatch => ({
  onFollow: username => dispatch({
    type: FOLLOW_USER,
    payload: agent.Profile.follow(username)
  }),
  onLoad: payload => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnfollow: username => dispatch({
    type: UNFOLLOW_USER,
    payload: agent.Profile.unfollow(username)
  }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED })
});


const Profile = props => {
  const {profile} = props;

  useEffect(() => {
    props.onLoad(Promise.all([
      agent.Profile.get(props.match.params.username),
      agent.Articles.byAuthor(props.match.params.username)
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
                    className="nav-link active"
                    to={`/@${props.profile.username}`}>
                    My Articles
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
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

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
export { Profile, mapStateToProps };
