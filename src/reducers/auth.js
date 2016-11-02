export default (state = {}, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload.errors : null
      };
    case 'ASYNC_START':
      if (action.subtype === 'LOGIN' || action.subtype === 'REGISTER') {
        return { ...state, inProgress: true };
      }
      break;
    case 'UPDATE_FIELD_AUTH':
      return { ...state, [action.key]: action.value };
  }

  return state;
};
