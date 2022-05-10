import { marketplaceConstants } from '../constants';

const initialState = {
  requesting: false,
  success: false,
  message: null,
  query: {},
  total: 0,
  data: []
}

export function accountAssetsReducer(state = initialState, payload) {

  switch (payload.type) {
    case marketplaceConstants.FETCH_ACCOUNT_ASSETS_REQUEST:
      return {
        ...state,
        requesting: true,
        query: payload.query ? payload.query : {},
      };
    case marketplaceConstants.FETCH_ACCOUNT_ASSETS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        data: payload.data,
        accountBorrowBalance: payload.accountBorrowBalance,
        accountSupplyBalance: payload.accountSupplyBalance,
        total: payload.total,
      };
    case marketplaceConstants.FETCH_ACCOUNT_ASSETS_ERROR:
      return {
        ...state,
        requesting: false,
        message: payload.message
      };

    default:
      return state;
  }
}