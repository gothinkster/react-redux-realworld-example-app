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
