import { web3Constants } from '../constants';

const initialState = {
  contractVEBANK: null,
  accountBorrowBalance: 0,
  accountSupplyBalance: 0,
  totalBorrow: 0,
  totalSupply: 0

};

export function accountOverview(state = initialState, action) {
  switch (action.type) {

    case web3Constants.ACCOUNT_OVERVIEW_VEBANK:
      return {
        ...state,
        ...action
      };

    default:
      return state;
  }
}