import ArticleList from "./ArticleList"
import React from "react"
import { Link } from "react-router-dom"
import agent from "../agent"
import { connect } from "react-redux"
import {
  FOLLOW_USER,
  UNFOLLOW_USER,
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
} from "../constants/actionTypes"

const EditProfileSettings = (props: { isUser: boolean }) => {
  if (props.isUser) {
    return (
      <Link to="/settings" className="btn btn-sm btn-outline-secondary action-btn">
        <i className="ion-gear-a"></i> Edit Profile Settings
      </Link>
    )
  }
  return null
}

const FollowUserButton = (props: {
  isUser: boolean
  user: { following: boolean; username: React.ReactNode }
  unfollow: (arg0: any) => void
  follow: (arg0: any) => void
}) => {
  if (props.isUser) {
    return null
  }

  let classes = "btn btn-sm action-btn"
  if (props.user.following) {
    classes += " btn-secondary"
  } else {
    classes += " btn-outline-secondary"
  }

  const handleClick = (ev: { preventDefault: () => void }) => {
    ev.preventDefault()
    if (props.user.following) {
      props.unfollow(props.user.username)
    } else {
      props.follow(props.user.username)
    }
  }

  return (
    <button className={classes} onClick={handleClick}>
      <i className="ion-plus-round"></i>
      &nbsp;
      {props.user.following ? "Unfollow" : "Follow"} {props.user.username}
    </button>
  )
}

const mapStateToProps = (state: {
  articleList: any[]
  common: { currentUser: any }
  profile: any
}) => ({
  ...state.articleList,
  currentUser: state.common.currentUser,
  profile: state.profile,
})

const mapDispatchToProps = (dispatch: (arg0: { type: string; payload?: any }) => any) => ({
  onFollow: (username: string) =>
    dispatch({
      type: FOLLOW_USER,
      payload: agent.Profile.follow(username),
    }),
  onLoad: (payload: any) => dispatch({ type: PROFILE_PAGE_LOADED, payload }),
  onUnfollow: (username: string) =>
    dispatch({
      type: UNFOLLOW_USER,
      payload: agent.Profile.unfollow(username),
    }),
  onUnload: () => dispatch({ type: PROFILE_PAGE_UNLOADED }),
})

class Profile extends React.Component<any> {
  componentWillMount() {
    this.props.onLoad(
      Promise.all([
        agent.Profile.get(this.props.match.params.username),
        agent.Articles.byAuthor(this.props.match.params.username),
      ]),
    )
  }

  componentWillUnmount() {
    this.props.onUnload()
  }

  renderTabs() {
    return (
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link className="nav-link active" to={`/@${this.props.profile.username}`}>
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link className="nav-link" to={`/@${this.props.profile.username}/favorites`}>
            Favorited Articles
          </Link>
        </li>
      </ul>
    )
  }

  render() {
    const profile = this.props.profile
    if (!profile) {
      return null
    }

    const isUser =
      this.props.currentUser && this.props.profile.username === this.props.currentUser.username

    return (
      <div className="profile-page">
        <div className="user-info">
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
                  follow={this.props.onFollow}
                  unfollow={this.props.onUnfollow}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-12 col-md-10 offset-md-1">
              <div className="articles-toggle">{this.renderTabs()}</div>

              <ArticleList
                pager={this.props.pager}
                articles={this.props.articles}
                articlesCount={this.props.articlesCount}
                currentPage={this.props.currentPage}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile)
export { Profile, mapStateToProps }
