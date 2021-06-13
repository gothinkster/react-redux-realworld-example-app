import {
  APP_LOAD,
  REDIRECT,
  LOGOUT,
  ARTICLE_SUBMITTED,
  SETTINGS_SAVED,
  DELETE_ARTICLE,
  EDITOR_PAGE_UNLOADED,
  HOME_PAGE_UNLOADED,
  PROFILE_PAGE_UNLOADED,
  PROFILE_FAVORITES_PAGE_UNLOADED,
  SETTINGS_PAGE_UNLOADED,
} from '../constants/actionTypes';
import { articlePageUnloaded } from './article';
import {
  login,
  register,
  loginPageUnloaded,
  registerPageUnloaded,
} from './auth';

const defaultState = {
  appName: 'Conduit',
  token: null,
  viewChangeCounter: 0,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case APP_LOAD:
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null,
      };
    case REDIRECT:
      return { ...state, redirectTo: null };
    case LOGOUT:
      return { ...state, redirectTo: '/', token: null, currentUser: null };
    case ARTICLE_SUBMITTED:
      const redirectUrl =
        action.payload.article && `/article/${action.payload.article.slug}`;
      return { ...state, redirectTo: redirectUrl };
    case SETTINGS_SAVED:
      return {
        ...state,
        redirectTo: action.error ? null : '/',
        currentUser: action.error ? null : action.payload.user,
      };
    case login.fulfilled.type:
    case register.fulfilled.type:
      return {
        ...state,
        redirectTo: '/',
        token: action.payload.user.token,
        currentUser: action.payload.user,
      };
    case DELETE_ARTICLE:
      return { ...state, redirectTo: '/' };
    case articlePageUnloaded.type:
    case EDITOR_PAGE_UNLOADED:
    case HOME_PAGE_UNLOADED:
    case PROFILE_PAGE_UNLOADED:
    case PROFILE_FAVORITES_PAGE_UNLOADED:
    case SETTINGS_PAGE_UNLOADED:
    case loginPageUnloaded.type:
    case registerPageUnloaded.type:
      return { ...state, viewChangeCounter: state.viewChangeCounter + 1 };
    default:
      return state;
  }
};
