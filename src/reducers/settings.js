import {
  SETTINGS_SAVED,
  SETTINGS_PAGE_UNLOADED,
  ASYNC_START
} from '../constants/actionTypes';

const defaultState = {
  inProgress: false,
  errors: null
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SETTINGS_SAVED:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case SETTINGS_PAGE_UNLOADED:
      return { ...defaultState };
    case ASYNC_START:
      if (action.subtype === SETTINGS_SAVED) {
        return {
          ...state,
          inProgress: true
        };
      }
    default:
      return state;
  }
};
