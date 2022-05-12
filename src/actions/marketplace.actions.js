
import queryString from 'query-string';
import { ethers } from 'ethers';

import { alertActions } from './alert.actions';
import { web3Constants, marketplaceConstants } from '../constants';

import * as actions from './';

import ERC20ABI_VB from '../_contracts/VB.json';
import ERC20ABI_VEUSD from '../_contracts/VEUSD.json';
import ERC20ABI_AAVE from '../_contracts/AaveProtocolDataProvider.json';
import ERC20ABI_WETH_GETAWAY from '../_contracts/WETHGateway.json';
import ERC20ABI_POOL from '../_contracts/Pool.json';
import ERC20ABI_STABLE_DEBT_TOKEN from '../_contracts/StableDebtToken.json';
import ERC20ABI_VARIBLE_DEBT_TOKEN from '../_contracts/VariableDebtToken.json';


const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY;//WETHGateway (chinh là VET Asset)
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;


// ------------------------ WITHDRAW ------------------------ //

/**
 * 
 * @param {*} dataToken 
 * @returns dispatch strore
 * 
 */
export const loadModalWithdraw = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 0;
    // let contractBorrow;
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

        const contractBorrow = new web3.eth.Contract(ERC20ABI_VB, dataToken.assetsAddress);

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
        type: marketplaceConstants.MODAL_OPEN_WITHDRAW_MARKET,
        accountApprove,
        accountBalance: accountBalance,
        dataToken
    });

};


/**
 * 
 * @param {*} dataToken 
 * @param {*} rateMode 
 * @returns 
 * interestRateMode: 0, 1, 2  => 0: None, 1: Stable, 2: Variable
 */

export const approveWithdraw = (dataToken, rateMode) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account, connex } = state.web3;

    let amountApprove = 10000000;

    if (account && dataToken.assetsAddress && rateMode) {

        let approveABI;
        let TOKEN_APPROVE;
        let approveMethod;

        if (dataToken.assetsChain === "VET") {

            TOKEN_APPROVE = ADDRESS_GATEWAY;
            approveABI = ERC20ABI_STABLE_DEBT_TOKEN.find(({ name, type }) => (name === "approveDelegation" && type === "function"));

            if (rateMode === 1) {
                approveMethod = connex.thor.account(process.env.REACT_APP_STABLE_DEBT_TOKEN_VET).method(approveABI);
            }

            if (rateMode === 2) {
                approveMethod = connex.thor.account(process.env.REACT_APP_VARIABLE_DEBT_TOKEN_VET).method(approveABI);
            }

        } else {
            TOKEN_APPROVE = ADDRESS_POOL;
            approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
            approveMethod = connex.thor.account(dataToken.assetsAddress).method(approveABI);
        }

        if (approveMethod) {
            approveMethod.transact(TOKEN_APPROVE, web3.utils.toWei(amountApprove.toString()))
                .comment(`approve ${dataToken.assetsChain} on VeBank`)
                .request()
                .then(result => {

                    dispatch({
                        type: marketplaceConstants.MODAL_OPEN_WITHDRAW_MARKET,
                        accountApprove: amountApprove
                    });

                    return result;

                }).catch((e) => {

                    console.log("error----", e);
                    return e;

                });
        }

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
export const withdrawMarket = (dataToken, amount, rateMode) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    if (connex && account && dataToken.assetsAddress) {

        dispatch({
            type: marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST
        });

        let amountWithdraw = web3.utils.toWei(amount.toString());

        // approve Atoken to move my 1e18 wei VeThor
        let approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        let approveMethod = connex.thor.account(process.env.REACT_APP_ATOKEN_VET).method(approveABI);
        const c1_approve = approveMethod.asClause(ADDRESS_GATEWAY, amountWithdraw)


        const withdrawETH_ABI = ERC20ABI_POOL.find(({ name, type }) => name === "withdraw" && type === "function");
        const methodWithdraw = connex.thor.account(ADDRESS_POOL).method(withdrawETH_ABI);
        const c2_withdraw = methodWithdraw.asClause(dataToken.assetsAddress, amountWithdraw, account)

        connex.vendor
            .sign('tx', [c1_approve, c2_withdraw])
            .comment(`transfer ${amount} ${dataToken.assetsChain} to Borrow VeBank`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_SUCCESS,
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
export const withdrawETHMarket = (dataToken, amount) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);

    if (connex && account && amount) {

        dispatch({
            type: marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST
        });

        const amountWithdraw = web3.utils.toWei(amount.toString());

        // approve Atoken to move my 1e18 wei VeThor
        let approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        let approveMethod = connex.thor.account(process.env.REACT_APP_ATOKEN_VET).method(approveABI);
        const c1_approve = approveMethod.asClause(ADDRESS_GATEWAY, amountWithdraw)


        const withdrawETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "withdrawETH" && type === "function");
        const methodWithdraw = connex.thor.account(ADDRESS_GATEWAY).method(withdrawETH_ABI);
        const c2_withdraw = methodWithdraw.asClause(ADDRESS_POOL, amountWithdraw, account)

        connex.vendor
            .sign('tx', [c1_approve, c2_withdraw])
            .comment(`transfer ${amount} VET to withdrawETH`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_SUCCESS,
                    transaction: 1
                });

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_WITHDRAW_MARKET_ERROR
                });

                return e;

            });

    }


};

// ------------------------ BORROW ------------------------ //

/**
 * 
 * @param {*} dataToken 
 * @returns dispatch strore
 * 
 */
export const loadModalBorrow = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 0;
    // let contractBorrow;

    let accountStableDebtApprove = 0;
    let accountVariableDebtApprove = 0;

    if (!account) {
        return;
    }

    if (dataToken.assetsChain === "VET") {

        const accountCoinVET = await dispatch(actions.instantiateVetContracts());
        if (accountCoinVET.balance) {
            accountBalance = ethers.utils.formatEther(accountCoinVET.balance);
            accountBalance = Math.round(accountBalance * 100) / 100;
        }

        // check approveDelegation
        let contractStableDebt = new web3.eth.Contract(ERC20ABI_STABLE_DEBT_TOKEN, process.env.REACT_APP_STABLE_DEBT_TOKEN_VET);
        accountStableDebtApprove = await contractStableDebt.methods.borrowAllowance(account, ADDRESS_GATEWAY).call();
        accountStableDebtApprove = ethers.utils.formatEther(accountStableDebtApprove);
        accountStableDebtApprove = Number(accountStableDebtApprove);

        // check approveDelegation
        let contractVariableDebt = new web3.eth.Contract(ERC20ABI_STABLE_DEBT_TOKEN, process.env.REACT_APP_STABLE_DEBT_TOKEN_VET);
        accountVariableDebtApprove = await contractVariableDebt.methods.borrowAllowance(account, ADDRESS_GATEWAY).call();
        accountVariableDebtApprove = ethers.utils.formatEther(accountVariableDebtApprove);
        accountVariableDebtApprove = Number(accountVariableDebtApprove);

    } else {

        const contractBorrow = new web3.eth.Contract(ERC20ABI_VB, dataToken.assetsAddress);

        if (contractBorrow && account) {
            const balanceBigN = await contractBorrow.methods.balanceOf(account).call();
            accountBalance = ethers.utils.formatUnits(balanceBigN, dataToken.assetsDecimals);
            accountBalance = Math.round(accountBalance * 100) / 100;
        }

        // get the approved coin MSP account
        accountApprove = await contractBorrow.methods.allowance(account, ADDRESS_POOL).call();
        accountApprove = ethers.utils.formatUnits(accountApprove, dataToken.assetsDecimals);
        accountApprove = Number(accountApprove);

    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
        accountApprove,
        accountStableDebtApprove,
        accountVariableDebtApprove,
        accountBalance: accountBalance,
        dataToken
    });

};


/**
 * 
 * @param {*} dataToken 
 * @param {*} rateMode 
 * @returns 
 * interestRateMode: 0, 1, 2  => 0: None, 1: Stable, 2: Variable
 */

export const approveBorrow = (dataToken, rateMode) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account, connex } = state.web3;

    let amountApprove = 10000000;

    if (account && dataToken.assetsAddress && rateMode) {

        let approveABI;
        let TOKEN_APPROVE;
        let approveMethod;

        if (dataToken.assetsChain === "VET") {

            TOKEN_APPROVE = ADDRESS_GATEWAY;
            approveABI = ERC20ABI_STABLE_DEBT_TOKEN.find(({ name, type }) => (name === "approveDelegation" && type === "function"));

            if (rateMode === 1) {
                approveMethod = connex.thor.account(process.env.REACT_APP_STABLE_DEBT_TOKEN_VET).method(approveABI);
            }

            if (rateMode === 2) {
                approveMethod = connex.thor.account(process.env.REACT_APP_VARIABLE_DEBT_TOKEN_VET).method(approveABI);
            }

        } else {
            TOKEN_APPROVE = ADDRESS_POOL;
            approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
            approveMethod = connex.thor.account(dataToken.assetsAddress).method(approveABI);
        }

        if (approveMethod) {
            approveMethod.transact(TOKEN_APPROVE, web3.utils.toWei(amountApprove.toString()))
                .comment(`approve ${dataToken.assetsChain} on VeBank`)
                .request()
                .then(result => {

                    dispatch({
                        type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
                        accountApprove: amountApprove
                    });

                    return result;

                }).catch((e) => {

                    console.log("error----", e);
                    return e;

                });
        }

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
export const borrowMarket = (dataToken, amount, rateMode) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    if (connex && account && dataToken.assetsAddress) {

        dispatch({
            type: marketplaceConstants.MODAL_BORROW_MARKET_REQUEST
        });

        const borrowABI = ERC20ABI_POOL.find(({ name, type }) => (name === "borrow" && type === "function"));

        const methodBorrow = connex.thor.account(ADDRESS_POOL).method(borrowABI);
        const amountBorrow = ethers.utils.parseUnits(amount.toString(), dataToken.assetsDecimals);

        methodBorrow.transact(dataToken.assetsAddress, amountBorrow, rateMode, 0, account)
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
                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_ERROR
                });
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
export const borrowETHMarket = (addressAsset, amount, rateMode) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);

    if (connex && account && amount) {

        dispatch({
            type: marketplaceConstants.MODAL_BORROW_MARKET_REQUEST
        });

        let amountBorrow = web3.utils.toWei(amount.toString());

        const borrowETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "borrowETH" && type === "function");
        const methodBorrow = connex.thor.account(ADDRESS_GATEWAY).method(borrowETH_ABI);

        //console.table([borrowETH_ABI, { ADDRESS_POOL, amountBorrow, rateMode }]);

        methodBorrow.value(amountBorrow);

        methodBorrow.transact(ADDRESS_POOL, amountBorrow, rateMode, 0)
            .comment(`transfer ${amount} VET to borrowETH`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_SUCCESS,
                    transaction: 1
                });

                return transaction;

            }).catch((e) => {
                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_ERROR
                });
                return e;

            });

    }


};



// ------------------------ SUPPLY ------------------------ //
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
            accountBalance = ethers.utils.formatUnits(balanceBigN, dataToken.assetsDecimals);
            accountBalance = Math.round(accountBalance * 100) / 100;

        }

        // get the approved coin MSP account
        accountApprove = await contractSupply.methods.allowance(account, ADDRESS_POOL).call();
        accountApprove = ethers.utils.formatEther(accountApprove);
        accountApprove = Number(accountApprove);

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
        const approveMethod = connex.thor.account(dataToken.assetsAddress).method(approveABI);

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


    const state = getState();

    const { account, connex } = state.web3;

    if (connex && account && dataToken.assetsAddress) {

        dispatch({
            type: marketplaceConstants.MODAL_SUPPLY_MARKET_REQUEST
        });

        const supplyABI = ERC20ABI_POOL.find(({ name, type }) => (name === "supply" && type === "function"));
        const methodSupply = connex.thor.account(ADDRESS_POOL).method(supplyABI);

        // const valueAmount = web3.utils.toWei(amount.toString());
        const valueAmount = ethers.utils.parseUnits(amount.toString(), dataToken.assetsDecimals);

        // console.log(dataToken.assetsAddress, valueAmount, account, 0);
        methodSupply.transact(dataToken.assetsAddress, valueAmount, account, 0)
            .comment(`transfer ${amount} ${dataToken.assetsChain} to Supply VeBank`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_SUPPLY_MARKET_SUCCESS,
                    transaction: 1
                });

                dispatch(actions.reloadAccountAssets());

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_ERROR
                });
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

                dispatch(actions.reloadAccountAssets());

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_BORROW_MARKET_ERROR
                });
                return e;

            });

    }


};