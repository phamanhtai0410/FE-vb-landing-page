
import queryString from 'query-string';
import { ethers } from 'ethers';

import { alertActions } from './alert.actions';
import { web3Constants, marketplaceConstants } from '../constants';

import * as actions from './';


import ERC20ABI_VB from '../_contracts/VB.json';

const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;

/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * 
 */
export const borrowMarket = (price) => async (dispatch, getState) => {


    const state = getState();

    const { web3, account } = state.web3;

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



/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const loadModalSupply = (token_address) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    let contractVB = new web3.eth.Contract(ERC20ABI_VB, token_address);

    let balance = 0;

    if (contractVB && account) {

        const balanceBigN = await contractVB.methods.balanceOf(account).call();

        balance = ethers.utils.formatEther(balanceBigN);

        balance = Math.round(balance * 100) / 100;

        console.log(balance)

    }


    dispatch({
        type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
    });

    setTimeout(() => {
        dispatch({
            type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
            transaction: 1
        });
        return true;
    }, 2000);

};


/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const supplyMarket = (price) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    let contractVB = new web3.eth.Contract(ERC20ABI_VB, TOKEN_VEBANK);

    let balance = 0;

    if (contractVB && account) {

        const balanceBigN = await contractVB.methods.balanceOf(account).call();

        balance = ethers.utils.formatEther(balanceBigN);

        balance = Math.round(balance * 100) / 100;

    }


    dispatch({
        type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
    });

    setTimeout(() => {
        dispatch({
            type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
            transaction: 1
        });
        return true;
    }, 2000);

};