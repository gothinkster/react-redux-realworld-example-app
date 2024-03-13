import React, { memo, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ArticleList from './ArticleList';
import {
  getArticlesByAuthor,
  getFavoriteArticles,
} from '../reducers/articleList';
import {
  follow,
  unfollow,
  getProfile,
  profilePageUnloaded,
} from '../reducers/profile';
import { selectUser } from '../features/auth/authSlice';

/**
 * Go to profile settings
 *
 * @example
 * <EditProfileSettings />
 */
function EditProfileSettings() {
  return (
    <Link
      to="/settings"
      className="btn btn-sm btn-outline-secondary action-btn"
    >
      <i className="ion-gear-a" /> Edit Profile Settings
    </Link>
  );
}

/**
 * Follow or unfollow an user
 *
 * @param {Object} props
 * @param {String} props.username
 * @param {Boolean} props.following
 * @example
 * <FollowUserButton username="warren_boyd" following />
 */
function FollowUserButton({ username, following }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  let classes = 'btn btn-sm action-btn';
  let textMessage;

  if (following) {
    classes += ' btn-secondary';
    textMessage = `Unfollow ${username}`;
  } else {
    classes += ' btn-outline-secondary';
    textMessage = `Follow ${username}`;
  }

  const handleClick = () => {
    if (!currentUser) {
      navigate.push(`/register?redirectTo=${location.pathname}`);
      return;
    }

    if (following) {
      dispatch(unfollow(username));
    } else {
      dispatch(follow(username));
    }
  };

  return (
    <button className={classes} onClick={handleClick}>
      <i className="ion-plus-round" />
      &nbsp;
      {textMessage}
    </button>
  );
}

/**
 * Show the profile of an user
 *
 * @param {Object} props
 * @param {Object} props.profile
 * @example
 * <UserInfo profile={{
 *      username: 'warren_boyd',
 *      email: 'warren.boyd@mailinator.com',
 *      image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
 *      bio: null,
 *      following: false,
 *    }}
 * />
 */
function UserInfo({ profile }) {
  const currentUser = useSelector(selectUser);
  const isCurrentUser = profile.username === currentUser?.username;

  return (
    <div className="user-info">
      <div className="container">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <img
              src={
                profile.image ||
                'https://static.productionready.io/images/smiley-cyrus.jpg'
              }
              className="user-img"
              alt={profile.username}
            />
            <h4>{profile.username}</h4>
            <p>{profile.bio}</p>

            {isCurrentUser ? (
              <EditProfileSettings />
            ) : (
              <FollowUserButton
                username={profile.username}
                following={profile.following}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Profile's navigation
 *
 * @param {Object}  props
 * @param {String}  props.username
 * @param {Boolean} props.isFavorites
 * @example
 * <ProfileTabs username="warren_boyd" isFavorites />
 */
function ProfileTabs({ username, isFavorites }) {
  return (
    <div className="articles-toggle">
      <ul className="nav nav-pills outline-active">
        <li className="nav-item">
          <Link
            className={isFavorites ? 'nav-link' : 'nav-link active'}
            to={`/@${username}`}
          >
            My Articles
          </Link>
        </li>

        <li className="nav-item">
          <Link
            className={isFavorites ? 'nav-link active' : 'nav-link'}
            to={`/@${username}/favorites`}
          >
            Favorited Articles
          </Link>
        </li>
      </ul>
    </div>
  );
}

/**
 * Profile screen component
 * @param {import('react-router-dom').RouteComponentProps<{ username: string }>} props
 * @example
 * <Profile />
 */
function Profile({ location, isFavoritePage }) {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.profile);
  const { username } = useParams();

  useEffect(() => {
    const fetchProfile = dispatch(getProfile(username));
    const fetchArticles = dispatch(
      isFavoritePage
        ? getFavoriteArticles({ username })
        : getArticlesByAuthor({ author: username })
    );

    return () => {
      fetchProfile.abort();
      fetchArticles.abort();
    };
  }, [username, isFavoritePage]);

  useEffect(() => () => dispatch(profilePageUnloaded()), []);

  if (!profile) {
    return null;
  }

  return (
    <div className="profile-page">
      <UserInfo profile={profile} />

      <div className="container page">
        <div className="row">
          <div className="col-xs-12 col-md-10 offset-md-1">
            <ProfileTabs
              username={profile.username}
              isFavorites={isFavoritePage}
            />

            <ArticleList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(Profile);
