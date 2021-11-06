import ListErrors from './ListErrors';
import React, {useState, useEffect} from 'react';
import agent from '../agent';
import { connect } from 'react-redux';
import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  LOGOUT
} from '../constants/actionTypes';

const SettingsForm = props => {
  const {currentUser} = props;
  const [state, setState] = useState(Object.assign({image:''}, currentUser));

  const updateState = field => ev => {
    setState(Object.assign({}, state, { [field]: ev.target.value }));
  };

  const submitForm = ev => {
    ev.preventDefault();

    const user = Object.assign({}, state);
    if (!user.password) {
      delete user.password;
    }

    props.onSubmitForm(user);
  };

  useEffect(() => {
    setState(Object.assign({}, state, currentUser));
  }, [props.currentUser])

  return (
    <form onSubmit={submitForm}>
      <fieldset>

        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            value={state.image}
            onChange={updateState('image')} />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Username"
            value={state.username}
            onChange={updateState('username')} />
        </fieldset>

        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows="8"
            placeholder="Short bio about you"
            value={state.bio}
            onChange={updateState('bio')}>
          </textarea>
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="email"
            placeholder="Email"
            value={state.email}
            onChange={updateState('email')} />
        </fieldset>

        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="New Password"
            value={state.password}
            onChange={updateState('password')} />
        </fieldset>

        <button
          className="btn btn-lg btn-primary pull-xs-right"
          type="submit"
          disabled={state.inProgress}>
          Update Settings
        </button>

      </fieldset>
    </form>
  );
}

const mapStateToProps = state => ({
  ...state.settings,
  currentUser: state.common.currentUser
});

const mapDispatchToProps = dispatch => ({
  onClickLogout: () => dispatch({ type: LOGOUT }),
  onSubmitForm: user =>
    dispatch({ type: SETTINGS_SAVED, payload: agent.Auth.save(user) }),
  onUnload: () => dispatch({ type: SETTINGS_PAGE_UNLOADED })
});

const Settings = props => {
  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">

            <h1 className="text-xs-center">Your Settings</h1>

            <ListErrors errors={props.errors}></ListErrors>

            <SettingsForm
              currentUser={props.currentUser}
              onSubmitForm={props.onSubmitForm} />

            <hr />

            <button
              className="btn btn-outline-danger"
              onClick={props.onClickLogout}>
              Or click here to logout.
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
