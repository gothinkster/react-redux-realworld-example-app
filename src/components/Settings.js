import React, { useEffect, useState } from 'react';
import ListErrors from './ListErrors';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  LOGOUT
} from '../constants/actionTypes';

const SettingsForm = ({ currentUser, inProgress, onSubmitForm }) => {
  const [user, setUser] = useState({
    image: '',
    username: '',
    bio: '',
    email: '',
    password: ''
  });


  const updateState = field => ev => {
    setUser({ ...user, [field]: ev.target.value });
  };

  const submitForm = ev => {
    let _user = {};
    ev.preventDefault();

    if (!user.password) {
      const { password, ...rest } = user;
      _user = rest;
    }

    onSubmitForm(_user);
  };

  useEffect(() => {
    if (currentUser) {
      const { image, bio } = currentUser;

      setUser({
        ...user,
        ...currentUser,
        image: image ? image : '',
        bio : bio ? bio : ''
      });
    }

  }, [currentUser]);

  return (
    <form onSubmit={submitForm}>
      <fieldset>

        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            value={user.image}
            onChange={updateState('image')} />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            value={user.username}
            onChange={updateState('username')} />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows="8"
            placeholder="Short bio about you"
            value={user.bio}
            onChange={updateState('bio')}>
          </textarea>
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value={user.email}
            onChange={updateState('email')} />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            value={user.password}
            onChange={updateState('password')} />
        </fieldset>

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={inProgress}>
          Update Settings
        </button>

      </fieldset>
    </form>
  );
};

const mapStateToProps = state => ({
  settings: state.settings,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onSubmitForm: user =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

const Settings = ({ settings, currentUser , onClickLogout, onSubmitForm, onUnload }) => {
  const { errors, inProgress } = settings;

  useEffect(() => {
    return () => onUnload();
  }, []);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">

            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={errors}></ListErrors>

            <SettingsForm
              currentUser={currentUser}
              onSubmitForm={onSubmitForm}
              inProgress={inProgress} />

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={onClickLogout}>
              Or click here to logout.
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
