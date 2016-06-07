'use strict';

export default (state = {}, action) => {
  switch (action.type) {
    case 'PROFILE_FAVORITES_PAGE_LOADED':
      return {
        ...action.payload[0].profile
      };
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
      return {};
  }

  return state;
};
