import { ethers } from 'ethers';

import {  marketplaceConstants } from '../../constants';

import ERC20ABI_AAVE from '../../_contracts/lend/AaveProtocolDataProvider.json';
import ERC20ABI_WETH_GETAWAY from '../../_contracts/lend/WETHGateway.json';
import ERC20ABI_POOL from '../../_contracts/lend/Pool.json';
import ERC20ABI_VARIBLE_DEBT_TOKEN from '../../_contracts/lend/VariableDebtToken.json';

const ADDRESS_GATEWAY = process.env.REACT_APP_ADDRESS_GATEWAY; // WETHGateway (chinh là VET Asset)
const ADDRESS_POOL = process.env.REACT_APP_ADDRESS_POOL;
const TOKEN_AAVE = process.env.REACT_APP_ADDRESS_PROTOCOL;

// ------------------------ REPAY ------------------------ //

/**
 * 
 * @param {*} dataToken 
 * @returns dispatch strore
 * 
 */
export const loadModalRepay = (dataToken) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    let accountBalance = 0;
    let accountApprove = 1;
    // let contractBorrow;

    if (!account || !dataToken) {
        return;
    }

    const contractAAVE = new web3.eth.Contract(ERC20ABI_AAVE, TOKEN_AAVE);

    let accountBalanceStableDebt = 0;
    let accountBalanceVariableDebt = 0;

    let accountVariableDebtApprove = 0;
    let accountStableDebtApprove = 0;

    if (dataToken.assetsAddress && contractAAVE) {

        const accountReserve = await contractAAVE.methods.getUserReserveData(dataToken.assetsAddress, account).call();


        if (accountReserve.currentVariableDebt !== "0") {
            accountBalanceVariableDebt = ethers.utils.formatUnits(accountReserve.currentVariableDebt, dataToken.assetsDecimals);
            // console.log("accountBalanceVariableDebt", accountBalanceVariableDebt)
            // accountBalanceVariableDebt = Math.round(accountBalanceVariableDebt * 100) / 100;
            // accountBalanceVariableDebt = Number(accountBalanceVariableDebt);
        }

        if (accountReserve.currentStableDebt !== "0") {
            accountBalanceStableDebt = ethers.utils.formatUnits(accountReserve.currentStableDebt, dataToken.assetsDecimals);
            // accountBalanceStableDebt = Math.round(accountBalanceStableDebt * 100) / 100;
            // accountBalanceStableDebt = Number(accountBalanceStableDebt);
        }

        // gia tri dc repay
        accountBalance = accountBalanceVariableDebt;

        let contractVariableDebt = new web3.eth.Contract(ERC20ABI_VARIBLE_DEBT_TOKEN, process.env.REACT_APP_VARIABLE_DEBT_TOKEN_VET);
        accountVariableDebtApprove = await contractVariableDebt.methods.borrowAllowance(account, ADDRESS_GATEWAY).call();

        accountVariableDebtApprove = ethers.utils.formatEther(accountVariableDebtApprove);
        accountVariableDebtApprove = Number(accountVariableDebtApprove);
        accountApprove = accountVariableDebtApprove;

    }

    dispatch({
        type: marketplaceConstants.MODAL_OPEN_REPAY_MARKET,
        accountApprove,
        accountStableDebtApprove,
        accountVariableDebtApprove,
        accountBalanceStableDebt,
        accountBalanceVariableDebt,
        accountBalance,
        dataToken
    });

};


/**
 * 
 * @param {number} id 
 * @returns dispatch strore
 *  borrow(addressAsset, amount, interestRateMode, referralCode, userAddress)  Ex: borrow(0x0fa8DC6200255Fc3382CDDb4B5358d7713D99c8d, "5000000000000000000", 1, 0, 0xeC310e7cC338f9087CaAcf291ba5023B3326626F)
 * 
 */
export const repayMarket = (dataToken, amount, rateMode = 2) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    if (connex && account && dataToken.assetsAddress && rateMode) {

        dispatch({
            type: marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST
        });

        let amountRepay = web3.utils.toWei(amount.toString());
        let amountApprove = 999999999;

        // approve Atoken 
        let approveABI = { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }
        // let approveMethod = connex.thor.account(process.env.REACT_APP_ATOKEN_VET).method(approveABI);

        let approveMethod = connex.thor.account(process.env.REACT_APP_ATOKEN_VET).method(approveABI);

        const c1_approve = approveMethod.asClause(ADDRESS_GATEWAY, web3.utils.toWei(amountApprove.toString()));

        const withdrawETH_ABI = ERC20ABI_POOL.find(({ name, type }) => name === "repay" && type === "function");
        const methodWithdraw = connex.thor.account(ADDRESS_POOL).method(withdrawETH_ABI);
        const c2_repay = methodWithdraw.asClause(dataToken.assetsAddress, amountRepay, rateMode, account);

        connex.vendor
            .sign('tx', [c1_approve, c2_repay])
            .comment(`transfer ${amount} ${dataToken.assetsChain} to Repay  VeBank`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_REPAY_MARKET_SUCCESS,
                    transaction: 1
                });

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_REPAY_MARKET_ERROR
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
export const repayETHMarket = (dataToken, amount, rateMode = 2) => async (dispatch, getState) => {

    const state = getState();

    const { web3, account, connex } = state.web3;

    // let contractGATEWAY = new web3.eth.Contract(ERC20ABI_WETH_GETAWAY, ADDRESS_GATEWAY);
    // console.log("repayETHMarket", connex, account, amount);

    if (connex && account && amount) {

        dispatch({
            type: marketplaceConstants.MODAL_WITHDRAW_MARKET_REQUEST
        });

        const amountRepay = web3.utils.toWei(amount.toString());
        let amountApprove = 999999999;

        // approve Atoken to move my 1e18 wei VeThor
        const approveABI = ERC20ABI_VARIBLE_DEBT_TOKEN.find(({ name, type }) => (name === "approveDelegation" && type === "function"));
        let approveMethod = connex.thor.account(process.env.REACT_APP_VARIABLE_DEBT_TOKEN_VET).method(approveABI);

        // console.log(process.env.REACT_APP_VARIABLE_DEBT_TOKEN_VET, ADDRESS_GATEWAY, amountRepay);
        const c1_approve = approveMethod.asClause(ADDRESS_GATEWAY, web3.utils.toWei(amountApprove.toString()));

        const repayETH_ABI = ERC20ABI_WETH_GETAWAY.find(({ name, type }) => name === "repayETH" && type === "function");
        const methodRepay = connex.thor.account(ADDRESS_GATEWAY).method(repayETH_ABI);

        methodRepay.value(amountRepay);
        const c2_repay = methodRepay.asClause(ADDRESS_POOL, amountRepay, rateMode, account);

        connex.vendor
            .sign('tx', [c1_approve, c2_repay])
            .comment(`transfer ${amount} VET to repayETH`)
            .request()
            .then(transaction => {

                dispatch({
                    type: marketplaceConstants.MODAL_REPAY_MARKET_SUCCESS,
                    transaction: 1
                });

                return transaction;

            }).catch((e) => {

                console.log("error----", e);
                dispatch({
                    type: marketplaceConstants.MODAL_REPAY_MARKET_ERROR
                });

                return e;

            });

    }


};
