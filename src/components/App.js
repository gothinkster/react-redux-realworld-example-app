import agent from '../agent';
import Header from './Header';
import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {APP_LOAD, REDIRECT} from '../constants/actionTypes';
import {Route, Switch} from 'react-router-dom';
import Article from '../components/Article';
import Editor from '../components/Editor';
import Home from '../components/Home';
import Login from '../components/Login';
import Profile from '../components/Profile';
import ProfileFavorites from '../components/ProfileFavorites';
import Register from '../components/Register';
import Settings from '../components/Settings';
import {store} from '../store';
import {push} from 'react-router-redux';

const mapStateToProps = state => {
    return {
        appLoaded: state.common.appLoaded,
        appName: state.common.appName,
        currentUser: state.common.currentUser,
        redirectTo: state.common.redirectTo
    }
};

const mapDispatchToProps = dispatch => ({
    onLoad: (payload, token) =>
        dispatch({type: APP_LOAD, payload, token, skipTracking: true}),
    onRedirect: () => {
        dispatch({type: REDIRECT});
    }

});

const App = (props) => {
    useEffect(() => {
        if (props.redirectTo) {
            store.dispatch(push(props.redirectTo));
            props.onRedirect();
        }
    }, [props.redirectTo]);

    useEffect(() => {
        // settings token
        const token = window.localStorage.getItem('jwt');
        if (token) {
            agent.setToken(token);
        }
        props.onLoad(token ? agent.Auth.current() : null, token);
    }, [])

    if (props.appLoaded) { console.log('here1');
        return (
            <div>
                <Header
                    appName={props.appName}
                    currentUser={props.currentUser}/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/register" component={Register}/>
                    <Route path="/editor/:slug" component={Editor}/>
                    <Route path="/editor" component={Editor}/>
                    <Route path="/article/:id" component={Article}/>
                    <Route path="/settings" component={Settings}/>
                    <Route path="/@:username/favorites" component={ProfileFavorites}/>
                    <Route path="/@:username" component={Profile}/>
                </Switch>
            </div>
        );
    } else {
        return (
            <div>
                <Header
                    appName={props.appName}
                    currentUser={props.currentUser}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
