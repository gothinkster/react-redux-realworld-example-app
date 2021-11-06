import { HOME_PAGE_LOADED, HOME_PAGE_UNLOADED } from '../constants/actionTypes';

export default (state = {}, action) => {
  if (!action.payload) return state;
  switch (action.type) {
    case HOME_PAGE_LOADED:
      return {
        ...state,
        tags: (!!action.payload[0] && action.payload[0].tags) || []
      };
    case HOME_PAGE_UNLOADED:
      return {};
    default:
      return state;
  }
};
