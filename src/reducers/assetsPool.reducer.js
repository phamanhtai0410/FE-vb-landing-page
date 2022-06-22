import { poolConstants } from "../constants";

import IcVeUSD from "../assets/images/ic_veusd.svg";
import IcVeChain from "../assets/images/ic_vechain.svg";
import IcVeBank from "../assets/images/ic_vebank.svg";
import IcVtho from "../assets/images/ic_vtho.svg";

const listAsset = [
  {
    iconOrigin: IcVeChain,
    iconAssets: IcVeUSD,
    assetsPoolName: "VET-VEUSD",
    assetsKey: process.env.REACT_APP_TOKEN_WVET + process.env.REACT_APP_TOKEN_VEUSD,
    assetsChainA: "VET",
    addressTokenA: process.env.REACT_APP_TOKEN_WVET,
    assetsChainB: "VEUSD",
    addressTokenB: process.env.REACT_APP_TOKEN_VEUSD,
    assetsPoolAddress: "",
    assetsDecimals: 18,
    balanceAccount:0,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },

  {
    iconOrigin: IcVeChain,
    iconAssets: IcVtho,
    assetsPoolName: "VET-VTHO",
    assetsKey: process.env.REACT_APP_TOKEN_WVET + process.env.REACT_APP_TOKEN_VTHO,
    assetsChainA: "VET",
    addressTokenA: process.env.REACT_APP_TOKEN_WVET,
    assetsChainB: "VTHO",
    addressTokenB: process.env.REACT_APP_TOKEN_VTHO,
    assetsPoolAddress: "",
    assetsDecimals: 18,
    balanceAccount:0,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },

  {
    iconOrigin: IcVeChain,
    iconAssets: IcVeBank,
    assetsPoolName: "VET-VB",
    assetsKey: process.env.REACT_APP_TOKEN_WVET + process.env.REACT_APP_TOKEN_VEBANK,
    assetsChainA: "VET",
    addressTokenA: process.env.REACT_APP_TOKEN_WVET,
    assetsChainB: "VB",
    addressTokenB: process.env.REACT_APP_TOKEN_VEBANK,
    assetsPoolAddress: "",
    assetsDecimals: 18,
    balanceAccount:0,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },

  {
    iconOrigin: IcVeBank,
    iconAssets: IcVtho,
    assetsPoolName: "VB-VTHO",
    assetsKey: process.env.REACT_APP_TOKEN_VEBANK + process.env.REACT_APP_TOKEN_VTHO,
    assetsChainA: "VB",
    addressTokenA: process.env.REACT_APP_TOKEN_VEBANK,
    assetsChainB: "VTHO",
    addressTokenB: process.env.REACT_APP_TOKEN_VTHO,
    assetsPoolAddress: "",
    assetsDecimals: 18,
    balanceAccount:0,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },
];

const initialState = {
  requesting: false,
  success: false,
  message: null,
  query: {},
  total: 0,
  listAsset,
  data: [],
};

export function assetsPoolReducer(state = initialState, payload) {

  switch (payload.type) {

    case poolConstants.FETCH_POOL_ASSETS_REQUEST:
      return {
        ...state,
        requesting: true,
        query: payload.query ? payload.query : {},
      };

    case poolConstants.FETCH_POOL_ASSETS_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        data: payload.data,
        total: payload.total,
      };

    case poolConstants.FETCH_POOL_ASSETS_ERROR:

      return {
        ...state,
        requesting: false,
        message: payload.message
      };

    default:
      return state;
  }
}
