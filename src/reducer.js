'use strict';

const articleList = require('./reducers/articleList');
const auth = require('./reducers/auth');
const editor = require('./reducers/editor');
const home = require('./reducers/home');
const profile = require('./reducers/profile');
const profileFavorites = require('./reducers/profileFavorites');
const settings = require('./reducers/settings');

const defaultState = {
  appName: 'Conduit',
  token: null,
  viewChangeCounter: 0
};

module.exports = (state = defaultState, action) => {
  state = articleList(state, action);
  state = auth(state, action);
  state = editor(state, action);
  state = home(state, action);
  state = profile(state, action);
  state = profileFavorites(state, action);
  state = settings(state, action);
  switch (action.type) {
    case 'APP_LOAD':
      const assignments = {
        token: action.token || null,
        appLoaded: true
      };
      if (action.payload) {
        assignments.currentUser = action.payload.user;
      }
      state = Object.assign({}, state, assignments)
      break;
    case 'REDIRECT':
      state = Object.assign({}, state, { redirectTo: null });
      break;
    case 'UPDATE_FIELD':
      state = Object.assign({}, state, { [action.key]: action.value });
      break;
    case 'ARTICLE_PAGE_LOADED':
      state = Object.assign({}, state, {
        article: action.payload[0].article,
        comments: action.payload[1].comments
      });
      break;
    case 'DELETE_ARTICLE':
      state = Object.assign({}, state, { redirectTo: '/' });
      break;
    case 'ARTICLE_PAGE_UNLOADED':
      if (state.outstandingActions) {
        state.outstandingActions.forEach(promise => promise.cancel());
      }
      return Object.assign({}, state, {
        article: null,
        comments: null,
        commentErrors: null,
        outstandingActions: null
      });
    case 'ADD_TAG':
      state = Object.assign({}, state);
      state.tagList.push(state.tagInput);
      state.tagInput = '';
      break;
    case 'REMOVE_TAG':
      state = Object.assign({}, state);
      const index = state.tagList.indexOf(action.tag);
      if (index !== -1) {
        state.tagList.splice(index, 1);
      }
      break;
    case 'ADD_COMMENT':
      state = Object.assign({}, state);
      if (action.error) {
        state.commentErrors = action.payload.errors;
      } else {
        state.comments = state.comments || [];
        state.comments.unshift(action.payload.comment);
      }
      break;
    case 'DELETE_COMMENT':
      state = Object.assign({}, state);
      const filter = comment => comment.id !== action.commentId;
      state.comments = _.filter(state.comments, filter);
      break;
    case 'ASYNC_START':
      const promise = Object.assign(action.promise, { cancel: action.cancel })
      return Object.assign({}, state, {
        outstandingActions: (state.outstandingActions || []).concat([promise])
      });
    case 'ASYNC_END':
      if (state.outstandingActions) {
        const filter = p => p !== action.promise;
        return Object.assign({}, state, {
          outstandingActions: state.outstandingActions.filter(filter)
        });
      }
  }

  return state;
};
