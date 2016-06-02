'use strict';

export default (state, action) => {
  switch (action.type) {
    case 'APP_LOAD':
      return {
        ...state,
        token: action.token || null,
        appLoaded: true,
        currentUser: action.payload ? action.payload.user : null
      };
    case 'REDIRECT':
      return { ...state, redirectTo: null };
    case 'UPDATE_FIELD':
      return { ...state, [action.key]: action.value };
  }

  return state;
};
