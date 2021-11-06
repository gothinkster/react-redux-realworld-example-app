import ListErrors from './ListErrors';
import React, {useEffect, useState} from 'react';
import agent from '../agent';
import {connect} from 'react-redux';
import {
    SETTINGS_SAVED,
    SETTINGS_PAGE_UNLOADED,
    LOGOUT
} from '../constants/actionTypes';
import useSingleton from "../hooks/useSingleton";

const SettingsForm = (props) => {
    console.log('props', props);
    const [state, setState] = useState({
        image: '',
        username: '',
        bio: '',
        email: '',
        password: ''
    });
    this.state = state;
    console.log('state', this.state);
    useSingleton(() => {

        this.updateState = field => ev => {
            const state = this.state;
            const newState = Object.assign({}, state, {[field]: ev.target.value});
            setState(newState);
        };

        this.submitForm = ev => {
            ev.preventDefault();

            const user = Object.assign({}, this.state);
            if (!user.password) {
                delete user.password;
            }

            props.onSubmitForm(user);
        };
    });

    useEffect(() => {
        if (props && props.currentUser) {
            Object.assign(this.state, {
                image: props.currentUser.image || '',
                username: props.currentUser.username,
                bio: props.currentUser.bio,
                email: props.currentUser.email
            });
        }
    }, [props.currentUser]);

    useEffect(() => {
        if (props && props.currentUser) {
            setState(Object.assign({}, this.state, {
                image: props.currentUser.image || '',
                username: props.currentUser.username,
                bio: props.currentUser.bio,
                email: props.currentUser.email
            }));
        }
    }, [props.currentUser])

    return (
        <form onSubmit={this.submitForm}>
            <fieldset>

                <fieldset className="form-group">
                    <input
                        className="form-control"
                        type="text"
                        placeholder="URL of profile picture"
                        value={this.state.image}
                        onChange={this.updateState('image')}/>
                </fieldset>

                <fieldset className="form-group">
                    <input
                        className="form-control form-control-lg"
                        type="text"
                        placeholder="Username"
                        value={this.state.username}
                        onChange={this.updateState('username')}/>
                </fieldset>

                <fieldset className="form-group">
                <textarea
                    className="form-control form-control-lg"
                    rows="8"
                    placeholder="Short bio about you"
                    value={this.state ? this.state.bio : ''}
                    onChange={this.updateState('bio')}>
                </textarea>
                </fieldset>

                <fieldset className="form-group">
                    <input
                        className="form-control form-control-lg"
                        type="email"
                        placeholder="Email"
                        value={this.state.email}
                        onChange={this.updateState('email')}/>
                </fieldset>

                <fieldset className="form-group">
                    <input
                        className="form-control form-control-lg"
                        type="password"
                        placeholder="New Password"
                        value={this.state.password}
                        onChange={this.updateState('password')}/>
                </fieldset>

                <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit"
                    disabled={this.state.inProgress}>
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
    onClickLogout: () => dispatch({type: LOGOUT}),
    onSubmitForm: user =>
        dispatch({type: SETTINGS_SAVED, payload: agent.Auth.save(user)}),
    onUnload: () => dispatch({type: SETTINGS_PAGE_UNLOADED})
});

const Settings = (props) => {
    return (
        <div className="settings-page">
            <div className="container page">
                <div className="row">
                    <div className="col-md-6 offset-md-3 col-xs-12">

                        <h1 className="text-xs-center">Your Settings</h1>

                        <ListErrors errors={props.errors}></ListErrors>

                        <SettingsForm
                            currentUser={props.currentUser}
                            onSubmitForm={props.onSubmitForm}/>

                        <hr/>

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
