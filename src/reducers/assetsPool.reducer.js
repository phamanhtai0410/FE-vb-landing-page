import { poolConstants } from '../constants';

import IcVeUSD from '../assets/images/ic_veusd.svg';
import IcVeChain from '../assets/images/ic_vechain.svg';
import IcVeBank from '../assets/images/ic_vebank.svg';
import IcVtho from '../assets/images/ic_vtho.svg';

const listAsset = [
  {
    iconOrigin: IcVeChain,
    iconAssets: IcVeUSD,
    assetsPoolName: "VET-VEUSD",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_VEUSD,
    assetsDecimals: 18,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },

  {
    iconOrigin: IcVeChain,
    iconAssets: IcVtho,
    assetsPoolName: "VET-VTHO",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_VTHO,
    assetsDecimals: 18,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },

  {
    iconOrigin: IcVeChain,
    iconAssets: IcVeBank,
    assetsPoolName: "VET-VB",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_VEBANK,
    assetsDecimals: 18,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },

  {
    iconOrigin: IcVeBank,
    iconAssets: IcVtho,
    assetsPoolName: "VB-VTHO",
    assetsPoolAddress: process.env.REACT_APP_TOKEN_WVET,
    assetsDecimals: 18,
    liquidity: "87,402,803",
    volume: "87,402,803",
    fees: "199,905",
    apr: 32.12,
  },


]

const initialState = {
  requesting: false,
  success: false,
  message: null,
  query: {},
  totalSupply: 0,
  totalBorrow: 0,
  total: 0,
  data: listAsset || []
}

export function assetsPoolReducer(state = initialState, payload) {

  switch (payload.type) {

    case poolConstants.FETCH_ASSETS_POOL_REQUEST:
      return {
        ...state,
        requesting: true,
        query: payload.query ? payload.query : {},
      };

    case poolConstants.FETCH_ASSETS_POOL_SUCCESS:
      return {
        ...state,
        requesting: false,
        success: true,
        data: payload.data,
        totalSupply: payload.totalSupply,
        totalBorrow: payload.totalBorrow,
        total: payload.total
      };

    case poolConstants.FETCH_ASSETS_POOL_ERROR:
      return {
        ...state,
        requesting: false,
        message: payload.message
      };

    default:
      return state;
  }
}