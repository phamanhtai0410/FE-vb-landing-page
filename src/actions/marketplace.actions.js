
import queryString from 'query-string';
import { ethers } from 'ethers';

import { alertActions } from './alert.actions';
import { web3Constants, marketplaceConstants } from '../constants';

import * as actions from './';

import ERC20ABI_VB from '../_contracts/VB.json';
import ERC20ABI_AAVE from '../_contracts/AaveProtocolDataProvider.json';
import ERC20ABI_WETH_GETAWAY from '../_contracts/WETHGateway.json';
import ERC20ABI_POOL from '../_contracts/Pool.json';


const TOKEN_AAVE = "0x4964b481dF13471f89781b09550484E82466352C";

const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;
const TOKEN_WVET = process.env.REACT_APP_TOKEN_WVET; // WVET(Wrapped VET)


const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY;//WETHGateway (chinh là VET Asset)
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;


/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const loadModalBorrow = (item) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let dataToken = item || null;

    if (!account) {
        return;
    }

    if (item.assetsChain === "VET") {

        const accountCoinVET = await dispatch(actions.instantiateVetContracts());
        if (accountCoinVET.balance) {
            accountBalance = ethers.utils.formatEther(accountCoinVET.balance);
            accountBalance = Math.round(accountBalance * 100) / 100;
        }

    } else {

        let contractModalSupply = new web3.eth.Contract(ERC20ABI_VB, item.assetsAddress);
        if (contractModalSupply && account) {

            const balanceBigN = await contractModalSupply.methods.balanceOf(account).call();
            accountBalance = ethers.utils.formatEther(balanceBigN);
            accountBalance = Math.round(accountBalance * 100) / 100;

        }

    }


    dispatch({
        type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
        accountBalance: accountBalance,
        dataToken
    });


};


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
export const loadModalSupply = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 0;
    let contractSupply;

    if (!account) {
        return;
    }

    if (dataToken.assetsChain === "VET") {

        const accountCoinVET = await dispatch(actions.instantiateVetContracts());

        if (accountCoinVET.balance) {
            accountBalance = ethers.utils.formatEther(accountCoinVET.balance);
            accountBalance = Math.round(accountBalance * 100) / 100;
        }

    } else {

        contractSupply = new web3.eth.Contract(ERC20ABI_VB, dataToken.assetsAddress);

        if (contractSupply && account) {

            const balanceBigN = await contractSupply.methods.balanceOf(account).call();
            accountBalance = ethers.utils.formatEther(balanceBigN);
            accountBalance = Math.round(accountBalance * 100) / 100;

        }

        // get the approved coin MSP account
        accountApprove = await contractSupply.methods.allowance(account, ADDRESS_POOL).call();
        accountApprove = ethers.utils.formatEther(accountApprove);
        accountApprove = Number(accountApprove)

    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET,
        contractSupply,
        accountBalance: accountBalance,
        dataToken,
        accountApprove
    });

};


export const approveSupply = (dataToken) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    const { contractSupply } = state.supplyReducer;

    const amountMax = 10000;

    if (account && contractSupply && dataToken.assetsAddress) {

        const approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        const approveMethod = connex.thor.account(dataToken.assetsAddress).method(approveABI)

        approveMethod
            .transact(ADDRESS_POOL, web3.utils.toWei(amountMax.toString()))
            .comment(`approve ${dataToken.assetsChain} on VeBank`)
            .request()
            .then(result => {

                dispatch({
                    type: marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET,
                    accountApprove: amountMax
                });

                return result;

            }).catch((e) => {

                console.log("error----", e);
                return e;

            });

    }

    // await contractSupply.methods.approve(dataToken.assetsAddress, web3.utils.toWei(amountMax.toString()))
    //     .send({ from: account })
    //     .then(() => {
    //         dispatch({
    //             type: marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET,
    //             accountApprove: amountMax
    //         });
    //         return amountMax;
    //     })
    //     .catch((e) => {
    //         if (e.code === 4001) {
    //             dispatch(alertActions.error(e.message))
    //         }
    //         return e;
    //     });



};




/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const supplyMarket = (dataToken, amount) => async (dispatch, getState) => {

    console.log("supplyMarket assetsAddress", dataToken)

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);

    if (connex && account && dataToken.assetsAddress) {


        dispatch({
            type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
        });

        const supplyABI = ERC20ABI_POOL.find(({ name, type }) => (name === "supply" && type === "function"));

        const methodSupply = connex.thor.account(ADDRESS_POOL).method(supplyABI);

        const valueAmount = web3.utils.toWei(amount.toString());

        // methodSupply.value(valueAmount);

        //supply(addressAsset, amount, account, referralCode)

        console.log(dataToken.assetsAddress, valueAmount, account, 0);

        methodSupply.transact(dataToken.assetsAddress, valueAmount, account, 0)
            .comment(`transfer ${amount} ${dataToken.assetsChain} to Supply VeBank`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
                    transaction: 1
                });

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                return e;

            });


    }


};


/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 * depositETH(PoolAddress,UserAddress, referralCode) await iWETHGateway.depositETH("0x...","0x.....", 0, {value: "100000000000000000"})
 * 
 */
export const supplyDepositETHMarket = (addressAsset, amount) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);

    if (connex && account) {

        dispatch({
            type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
        });

        const depositETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name }) => name === "depositETH");
        const methodDepositETH = connex.thor.account(ADDRESS_GATEWAY).method(depositETH_ABI);

        methodDepositETH.value(web3.utils.toWei(amount.toString()));
        methodDepositETH.transact(ADDRESS_POOL, account, 0)
            .comment(`transfer ${amount} VET to DepositETH`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
                    transaction: 1
                });

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                return e;

            });

    }


};