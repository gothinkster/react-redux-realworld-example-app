'use strict';

module.exports = (state = defaultState, action) => {
  switch (action.type) {
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
      return Object.assign({}, state, {
        viewChangeCounter: state.viewChangeCounter + 1
      });
  }

  return state;
};
