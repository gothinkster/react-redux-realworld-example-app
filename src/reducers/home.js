'use strict';

export default (state = {}, action) => {
  switch (action.type) {
    case 'HOME_PAGE_LOADED':
      return {
        ...state,
        tags: action.payload[0].tags
      };
    case 'HOME_PAGE_UNLOADED':
      return {};
  }

  return state;
};
