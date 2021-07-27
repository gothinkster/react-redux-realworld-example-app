/**
 * States of the slice
 * @readonly
 * @enum {string}
 */
export const Status = {
  /** The initial state */
  IDLE: 'idle',
  /** The loading state */
  LOADING: 'loading',
  /** The success state */
  SUCCESS: 'success',
  /** The error state */
  FAILURE: 'failure',
};

/**
 * Check if error is an ApiError
 *
 * @param {object} error
 * @returns {boolean} error is ApiError
 */
export function isApiError(error) {
  return typeof error === 'object' && error !== null && 'errors' in error;
}

/**
 * Set state as loading
 *
 * @param {import('@reduxjs/toolkit').Draft<AuthState>} state
 */
export function loadingReducer(state) {
  state.status = Status.LOADING;
}

/**
 * @param {import('@reduxjs/toolkit').Draft<AuthState>} state
 * @param {import('@reduxjs/toolkit').PayloadAction<{errors: Record<string, string[]}>} action
 */
export function failureReducer(state, action) {
  state.status = Status.FAILURE;
  state.errors = action.payload.errors;
}
