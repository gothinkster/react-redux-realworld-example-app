import {
  PROFILE_PAGE_LOADED,
  PROFILE_PAGE_UNLOADED,
} from '../constants/actionTypes';

export default (state = {}, action) => {
  switch (action.type) {
    case PROFILE_PAGE_LOADED:
      return {
        ...action.payload[0].profile
      };
    case PROFILE_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
