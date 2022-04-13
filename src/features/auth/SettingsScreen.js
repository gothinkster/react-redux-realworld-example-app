import React, { memo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import ListErrors from '../../components/ListErrors';
import {
  logout,
  selectErrors,
  selectIsAuthenticated,
  selectIsLoading,
  selectUser,
  updateUser,
} from './authSlice';

/**
 * Settings form component
 *
 * @param {Object} props
 * @param {import('./authSlice').User} props.currentUser
 * @param {(user: Partial<import('./authSlice').User>) => Promise<any>} props.onSaveSettings
 * @example
 * <SettingsForm
 *    currentUser={{
 *      username: 'warren_boyd',
 *      email: 'warren.boyd@mailinator.com',
 *      image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
 *      bio: null,
 *    }}
 *    onSaveSettings={user => dispatch(updateUser(user))}
 * />
 */
function SettingsForm({ currentUser, onSaveSettings }) {
  const [image, setImage] = useState(
    currentUser?.image ??
      'https://static.productionready.io/images/smiley-cyrus.jpg'
  );
  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [password, setPassword] = useState('');
  const isLoading = useSelector(selectIsLoading);

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeImage = (event) => {
    setImage(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeUsername = (event) => {
    setUsername(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeBio = (event) => {
    setBio(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changeEmail = (event) => {
    setEmail(event.target.value);
  };

  /**
   * @type {React.ChangeEventHandler<HTMLInputElement>}
   */
  const changePassword = (event) => {
    setPassword(event.target.value);
  };

  /**
   * @type {React.FormEventHandler<HTMLFormElement>}
   */
  const saveSettings = (event) => {
    event.preventDefault();

    const user = {
      image,
      username,
      bio,
      email,
    };

    if (password) {
      user.password = password;
    }

    onSaveSettings(user);
  };

  return (
    <form onSubmit={saveSettings}>
      <fieldset disabled={isLoading}>
        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            name="image"
            value={image}
            onChange={changeImage}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            name="username"
            value={username}
            onChange={changeUsername}
          />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
            name="bio"
            value={bio}
            onChange={changeBio}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            autoComplete="current-email"
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={changeEmail}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            autoComplete="current-password"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={changePassword}
          />
        </fieldset>

        <button className="btn btn-lg btn-primary pull-xs-right" type="submit">
          Update Settings
        </button>
      </fieldset>
    </form>
  );
}

/**
 * Settings screen component
 *
 * @example
 * <SettingsScreen />
 */
function SettingsScreen() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const errors = useSelector(selectErrors);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const saveSettings = (user) => {
    void dispatch(updateUser(user));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={errors} />

            <SettingsForm
              currentUser={currentUser}
              onSaveSettings={saveSettings}
            />

            <hr />

            <button className="btn btn-outline-danger" onClick={logoutUser}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(SettingsScreen);
