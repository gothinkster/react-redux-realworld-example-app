import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import ListErrors from './ListErrors';
import { logout, selectUser } from '../features/auth/authSlice';
import { saveSettings, settingsPageUnloaded } from '../reducers/settings';

/**
 * Settings form component
 *
 * @param {Object} props
 * @param {Object} props.currentUser
 * @param {String} props.currentUser.image
 * @param {String} props.currentUser.username
 * @param {String} props.currentUser.bio
 * @param {String} props.currentUser.email
 * @param {Boolean} [props.inProgress=false]
 * @param {(user: Partial<currentUser>) => Promise<any>} props.onSaveSettings
 * @example
 * <SettingsForm
 *    currentUser={{
 *      username: 'warren_boyd',
 *      email: 'warren.boyd@mailinator.com',
 *      image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
 *      bio: null,
 *    }}
 *    onSaveSettings={user => dispatch(saveSettings(user))}
 * />
 */
export function SettingsForm({ currentUser, inProgress, onSaveSettings }) {
  const [image, setImage] = useState(
    currentUser?.image ??
      'https://static.productionready.io/images/smiley-cyrus.jpg'
  );
  const [username, setUsername] = useState(currentUser?.username ?? '');
  const [bio, setBio] = useState(currentUser?.bio ?? '');
  const [email, setEmail] = useState(currentUser?.email ?? '');
  const [password, setPassword] = useState('');

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

  const submitForm = (event) => {
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
    <form onSubmit={submitForm}>
      <fieldset>
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
            rows="8"
            placeholder="Short bio about you"
            name="bio"
            value={bio}
            onChange={changeBio}
          />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            autoComplete="username"
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

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={inProgress}
        >
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
 * <Settings />
 */
function Settings() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUser);
  const { errors, inProgress } = useSelector((state) => state.settings);

  const dispatchSaveSettings = async (user) => {
    await dispatch(saveSettings(user));
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  useEffect(() => () => dispatch(settingsPageUnloaded()), []);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={errors} />

            <SettingsForm
              currentUser={currentUser}
              inProgress={inProgress}
              onSaveSettings={dispatchSaveSettings}
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

export default Settings;
