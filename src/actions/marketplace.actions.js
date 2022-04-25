
import queryString from 'query-string';
import { ethers } from 'ethers';

import { alertActions } from './alert.actions';
import { web3Constants, marketplaceConstants } from '../constants';

import * as actions from './';

/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * 
 */
export const borrowMarket = (price) => async (dispatch, getState) => {

    const state = getState();

    dispatch({
        type: marketplaceConstants.MODAL_BORROW_MARKET_REQUEST
    })

    setTimeout(() => {
        dispatch({
            type: marketplaceConstants.MODAL_BORROW_MARKET_SUCCESS,
            transaction: 1
        });
        return true;
    }, 2000);

    // const { web3, account } = state.web3;

    // let { contractLUWA } = state.saleReducer;

    // const tokenID = String(id);

    // if (web3 && contractLUWA && tokenID) {

    //     dispatch({
    //         type: marketplaceConstants.MODAL_SALE_ON_MARKET_REQUEST
    //     })

    //     const dataInfo = await contractLUWA.methods.tokenDetails(tokenID).call();

    //     if (dataInfo.on_market === "1") {
    //         const message = `Warning the Basket ID ${id} has on marketplace !!`;
    //         const errorCode = "ERROR_SOLD";
    //         dispatch({
    //             type: marketplaceConstants.MODAL_SALE_ON_MARKET_ERROR,
    //             errorCode,
    //             message
    //         })
    //         return;
    //     }

    //     if (dataInfo.is_opened === "1") {
    //         const message = `Warning the Basket ID ${id} has been opened !!`;
    //         const errorCode = "ERROR_SOLD";
    //         dispatch({
    //             type: marketplaceConstants.MODAL_SALE_ON_MARKET_ERROR,
    //             errorCode,
    //             message
    //         })
    //         return;
    //     }

    //     await contractLUWA.methods
    //         .sale(tokenID, price)
    //         .send({ from: account })
    //         .then((transaction) => {

    //             dispatch({
    //                 type: marketplaceConstants.MODAL_SALE_ON_MARKET_SUCCESS,
    //                 transaction
    //             });

    //             return transaction;

    //         }).catch((e) => {

    //             console.log("------error saleLUS", e);

    //             if (e.code === 4001) {
    //                 dispatch(alertActions.error(e.message))
    //             }

    //             dispatch({
    //                 type: marketplaceConstants.MODAL_SALE_ON_MARKET_ERROR
    //             })

    //             return e;
    //         });

    // }

};