import { poolConstants } from "../constants";

const initialState = {
  isAddLiquidModalOpen: false,
  isSelectTokenModalOpen: false,
  pending: false,

  transaction: null,
  errorCode: null,
  message: null,

  accountBalance: 0,
  accountApprove: 0,
  accountStableDebtApprove: 0,
  accountVariableDebtApprove: 0,

  firstToken: null,
  secondToken: null,
  tokenSelecting: "",

  dataToken: null,
  data: {},
};

export function liquidReducer(state = initialState, action) {
  switch (action.type) {
    case poolConstants.MODAL_OPEN_ADD_LIQUIDITY:
      return {
        ...state,
        isAddLiquidModalOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case poolConstants.MODAL_ADD_LIQUIDITY_REQUEST:
      return {
        ...state,
        transaction: null,
        pending: true,
      };

    case poolConstants.MODAL_ADD_LIQUIDITY_SUCCESS:
      return {
        ...state,
        pending: false,
        transaction: action.transaction,
      };

    case poolConstants.MODAL_ADD_LIQUIDITY_ERROR:
      return {
        ...state,
        pending: false,
        ...action,
      };

    case poolConstants.MODAL_CLOSE_ADD_LIQUIDITY:
      return {
        ...state,
        isAddLiquidModalOpen: false,
        pending: false,
        transaction: null,
        data: {},
        firstToken: null,
        secondToken: null,
        message: null,
      };
    case poolConstants.MODAL_OPEN_SELECT_TOKEN:
      return {
        ...state,
        isSelectTokenModalOpen: true,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case poolConstants.MODAL_OPEN_SELECT_FIRST_TOKEN:
      return {
        ...state,
        isSelectTokenModalOpen: true,
        tokenSelecting: poolConstants.FIRST_TOKEN,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case poolConstants.MODAL_OPEN_SELECT_SECOND_TOKEN:
      return {
        ...state,
        isSelectTokenModalOpen: true,
        tokenSelecting: poolConstants.SECOND_TOKEN,
        pending: false,
        errorCode: null,
        message: null,
        ...action,
      };

    case poolConstants.MODAL_SELECT_TOKEN: {
      const newState = {
        ...state,
        isSelectTokenModalOpen: false,
        tokenSelecting: "",
        errorCode: null,
        message: null,
        ...action,
      };
      if (state.tokenSelecting === poolConstants.FIRST_TOKEN) {
        newState.firstToken = action.payload;
      } else {
        newState.secondToken = action.payload;
      }
      return newState;
    }

    case poolConstants.MODAL_SELECT_TOKEN_REQUEST:
      return {
        ...state,
        transaction: null,
        pending: true,
      };

    case poolConstants.MODAL_SELECT_TOKEN_SUCCESS:
      return {
        ...state,
        pending: false,
        transaction: action.transaction,
      };

    case poolConstants.MODAL_SELECT_TOKEN_ERROR:
      return {
        ...state,
        pending: false,
        ...action,
      };

    case poolConstants.MODAL_CLOSE_SELECT_TOKEN:
      return {
        ...state,
        isSelectTokenModalOpen: false,
        tokenSelecting: "",
        pending: false,
        transaction: null,
        data: {},
        message: null,
      };

    default:
      return state;
  }
}

export const selectLiquidReducer = (state) => state.liquidReducer;
export const selectOpenAddLiquidState = state => state.liquidReducer.isAddLiquidModalOpen
export const selectFirstToken = (state) => state.liquidReducer.firstToken;
export const selectSecondToken = (state) => state.liquidReducer.secondToken;
