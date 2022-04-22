import { web3Constants } from '../constants';

const initialState = {
  web3: null,
  account: null
};

export function web3(state = initialState, action) {
  switch (action.type) {
    case web3Constants.WEB3_CONNECT:
      return {
        ...state,
        account: action.account,
        web3: action.web3
      };
    case web3Constants.WEB3_DISCONNECT:
      return {
        ...state,
        account: null,
        web3: null
      };
    default:
      return state;
  }
}