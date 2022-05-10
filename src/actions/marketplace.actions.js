
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
export const loadModalBorrow = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 0;
    let contractBorrow;

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

        contractBorrow = new web3.eth.Contract(ERC20ABI_VB, dataToken.assetsAddress);

        if (contractBorrow && account) {

            const balanceBigN = await contractBorrow.methods.balanceOf(account).call();
            accountBalance = ethers.utils.formatEther(balanceBigN);
            accountBalance = Math.round(accountBalance * 100) / 100;

        }

        // get the approved coin MSP account
        accountApprove = await contractBorrow.methods.allowance(account, ADDRESS_POOL).call();
        accountApprove = ethers.utils.formatEther(accountApprove);
        accountApprove = Number(accountApprove)

    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
        contractBorrow,
        accountBalance: accountBalance,
        dataToken,
        accountApprove
    });

};

export const approveBorrow = (dataToken) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    const { contractBorrow } = state.borrowReducer;

    const amountMax = 10000;

    if (account && contractBorrow && dataToken.assetsAddress) {

        const approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        const approveMethod = connex.thor.account(dataToken.assetsAddress).method(approveABI)

        approveMethod
            .transact(ADDRESS_POOL, web3.utils.toWei(amountMax.toString()))
            .comment(`approve ${dataToken.assetsChain} on VeBank`)
            .request()
            .then(result => {

                dispatch({
                    type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
                    accountApprove: amountMax
                });

                return result;

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
 *  borrow(addressAsset, amount, interestRateMode, referralCode, userAddress)  Ex: borrow(0x0fa8DC6200255Fc3382CDDb4B5358d7713D99c8d, "5000000000000000000", 1, 0, 0xeC310e7cC338f9087CaAcf291ba5023B3326626F)
 * 
 * 
 */
export const borrowMarket = (dataToken, amount) => async (dispatch, getState) => {

    console.log("supplyMarket assetsAddress", dataToken)

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);

    if (connex && account && dataToken.assetsAddress) {


        dispatch({
            type: marketplaceConstants.MODAL_BORROW_MARKET_REQUEST
        });

        const borrowABI = ERC20ABI_POOL.find(({ name, type }) => (name === "borrow" && type === "function"));

        const methodBorrow = connex.thor.account(ADDRESS_POOL).method(borrowABI);

        const valueAmount = web3.utils.toWei(amount.toString());

        console.log(dataToken.assetsAddress, valueAmount, account, 0);

        methodBorrow.transact(dataToken.assetsAddress, valueAmount, account, 0)
            .comment(`transfer ${amount} ${dataToken.assetsChain} to Borrow VeBank`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_SUCCESS,
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
 * borrowETH(PoolAddress, amount, interestRateMode, referralCode) await iWETHGateway.borrowETH("0x", "80000000000000000", 2, 0);
 * "interestRateMode: 0, 1, 2 => 0: None, 1: Stable, 2: Variable"
 */
export const borrowDepositETHMarket = (addressAsset, amount, rateMode) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);

    if (connex && account && amount) {

        dispatch({
            type: marketplaceConstants.MODAL_BORROW_MARKET_REQUEST
        });

        const borrowETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "borrowETH" && type === "function");

        // console.log(borrowETH_ABI);
        // console.log(ADDRESS_POOL, web3.utils.toWei(amount.toString()), rateMode);

        const methodBorrow = connex.thor.account(ADDRESS_GATEWAY).method(borrowETH_ABI);

        //methodBorrow.value(web3.utils.toWei(amount.toString()));
        //methodBorrow.transact(ADDRESS_POOL, web3.utils.toWei(amount.toString()), rateMode.toString(), 0)
        methodBorrow.value(web3.utils.toWei(amount.toString()));
        methodBorrow.transact(ADDRESS_POOL, web3.utils.toWei(amount.toString()), "2", 0)
            .comment(`transfer ${amount} VET to DepositETH`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_SUCCESS,
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

    if (connex && account) {

        dispatch({
            type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
        });

        const depositETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "depositETH" && type === "function");
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