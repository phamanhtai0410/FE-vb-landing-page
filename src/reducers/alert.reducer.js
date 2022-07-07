import { alertConstants } from '../constants';

export function alert(state = {}, action) {
  switch (action.type) {
    case alertConstants.LOADING:
      return {
        type: 'loading',
        message: action.message,
        key: action.key
      };
    case alertConstants.UPDATE:
      return {
        type: 'update',
        message: action.message,
        key: action.key,
        status: action.status
      };
    case alertConstants.SUCCESS:
      return {
        type: 'success',
        message: action.message
      };
    case alertConstants.WARNING:
      return {
        type: 'warning',
        message: action.message
      };
    case alertConstants.ERROR:
      return {
        type: 'error',
        message: action.message
      };
    case alertConstants.CLEAR:
      return {};
    default:
      return state
  }
}