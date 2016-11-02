export default (state = {}, action) => {
  switch (action.type) {
    case 'PROFILE_PAGE_LOADED':
    case 'PROFILE_FAVORITES_PAGE_LOADED':
      return {
        ...action.payload[0].profile
      };
    case 'PROFILE_PAGE_UNLOADED':
    case 'PROFILE_FAVORITES_PAGE_UNLOADED':
      return {};
    case 'FOLLOW_USER':
    case 'UNFOLLOW_USER':
      return {
        ...action.payload.profile
      };
  }

  return state;
};
