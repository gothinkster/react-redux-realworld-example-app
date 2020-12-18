import {
  LOGIN,
  REGISTER,
  LOGIN_PAGE_UNLOADED,
  REGISTER_PAGE_UNLOADED,
  ASYNC_START,
  UPDATE_FIELD_AUTH,
} from "../constants/actionTypes"

export default (
  state: any = {},
  action: {
    type?: string
    error?: any
    payload?: { errors?: any }
    subtype?: string
    key?: any
    value?: any
  },
) => {
  switch (action.type) {
    case LOGIN:
    case REGISTER:
      return {
        ...state,
        inProgress: false,
        errors: action.error ? action.payload?.errors : null,
      }
    case LOGIN_PAGE_UNLOADED:
    case REGISTER_PAGE_UNLOADED:
      return {}
    case ASYNC_START:
      if (action.subtype === LOGIN || action.subtype === REGISTER) {
        return { ...state, inProgress: true }
      }
      break
    case UPDATE_FIELD_AUTH:
      return { ...state, [action.key]: action.value }
    default:
      return state
  }

  return state
}
