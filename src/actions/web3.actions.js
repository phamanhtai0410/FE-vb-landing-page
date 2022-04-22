
import { ethers } from 'ethers';
import { alertActions } from './alert.actions';
import { web3Constants } from '../constants';
import getWeb3 from '../utils/getWeb3';

import ERC20ABI from '../_contracts/abi-erc20.json';
import ERC20ABI_MSP from '../_contracts/MSP.json';

const TOKEN_BUSD = process.env.REACT_APP_TOKEN_BUSD;
const TOKEN_MSP = process.env.REACT_APP_TOKEN_MSP;

const chainID = process.env.REACT_APP_NETWORK_ID;
const networks = {
    bsc_testnet: {
        chainId: `0x${Number(97).toString(16)}`, // A 0x-prefixed hexadecimal string
        chainName: "Binance Smart Chain Testnet",
        nativeCurrency: {
            name: "Binance Chain Native Token",
            symbol: "tBNB", // 2-6 characters long
            decimals: 18,
        },
        rpcUrls: [
            "https://data-seed-prebsc-1-s1.binance.org:8545",
            "https://data-seed-prebsc-2-s1.binance.org:8545",
            "https://data-seed-prebsc-1-s2.binance.org:8545",
            "https://data-seed-prebsc-2-s2.binance.org:8545",
            "https://data-seed-prebsc-1-s3.binance.org:8545",
            "https://data-seed-prebsc-2-s3.binance.org:8545"
        ],
        blockExplorerUrls: ["https://testnet.bscscan.com"],
    },
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "Binance Smart Chain Mainnet",
        nativeCurrency: {
            name: "Binance Chain Native Token",
            symbol: "BNB",
            decimals: 18
        },
        rpcUrls: [
            "https://bsc-dataseed1.binance.org",
            "https://bsc-dataseed2.binance.org",
            "https://bsc-dataseed3.binance.org",
            "https://bsc-dataseed4.binance.org",
            "https://bsc-dataseed1.defibit.io",
            "https://bsc-dataseed2.defibit.io",
            "https://bsc-dataseed3.defibit.io",
            "https://bsc-dataseed4.defibit.io",
            "https://bsc-dataseed1.ninicoin.io",
            "https://bsc-dataseed2.ninicoin.io",
            "https://bsc-dataseed3.ninicoin.io",
            "https://bsc-dataseed4.ninicoin.io",
            "wss://bsc-ws-node.nariox.org"
        ],
        blockExplorerUrls: ["https://bscscan.com"]
    }
};

async function checkChainSwitch(web3) {

    const chainIdDec = await web3.eth.getChainId();
    return chainID === chainIdDec.toString();

}

export const web3Connect = (isLogin) => async (dispatch) => {

    const web3 = await getWeb3();

    if (web3.givenProvider === null) {
        if (isLogin) {
            dispatch(alertActions.error('Please connect to MetaMask!'));
        }
        return web3;
    }

    let account;
    const chainActived = await checkChainSwitch(web3);

    if (window.ethereum && chainActived === false) {
        await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
                {
                    ...networks[process.env.REACT_APP_NETWORK_NAME]
                    //...networks["bsc_testnet"]
                }
            ]
        });
        return account;
    }

    // imposition login when khi pruchase and buy
    if (isLogin && !chainActived) {

        try {
            await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: `0x${Number(chainID).toString(16)}` }] })
        } catch (error) {
            if (error.code === 4001) {
                dispatch(alertActions.error(error.message));
            }
            if (error.code === 4902) {
                dispatch(alertActions.error("Unrecognized chain ID " + (chainID)));
            }
        }
        return account;
    }

    // Acccounts now exposed
    let checkConected = [];
    let _acc = localStorage.getItem('_acc');
    if (window.ethereum && isLogin) {

        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [
                {
                    eth_accounts: {}
                }
            ]
        });

        checkConected = await web3.eth.getAccounts();

        if (checkConected) {
            _acc = checkConected[0];
            localStorage.setItem('_acc', checkConected[0]);
        }

    }

    if (_acc) {
        try {
            checkConected = await web3.eth.getAccounts();
        } catch (error) {
            if (isLogin) {
                dispatch(alertActions.error('Please connect to MetaMask!'));
            }
            return account;
        }
    }


    // account conected when mart chain dapp
    if (checkConected.length > 0 && chainActived === false) {
        try {

            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        ...networks[process.env.REACT_APP_NETWORK_NAME]
                        //...networks["bsc_testnet"]
                    }
                ]
            });


            // await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x61' }] })
        } catch (error) {

            if (error.code === 4001) {
                dispatch(alertActions.error(error.message));
            }

            if (error.code === -32603) {
                dispatch(alertActions.error("Not found network chainId " + process.env.REACT_APP_NETWORK_ID));
            }

        }
        return account;

    }


    // No account access
    if (checkConected.length === 0 && isLogin === false) {

        dispatch({
            type: web3Constants.WEB3_CONNECT,
            web3,
            account
        });

        return account;

    }

    let checkAccount;

    try {

        // connect wallet
        checkAccount = await window.ethereum.enable();

    } catch (e) {

        if (e.code === 4001) {
            dispatch(alertActions.error(e.message))
        }

        return account;


    }

    if (checkAccount) {

        try {

            const accounts = await web3.eth.getAccounts();
            if (accounts && accounts.length > 0) {
                account = accounts[0];
            }

        } catch (error) {

            console.log("------------web3Connect getAccounts error", error);

        }

        dispatch({
            type: web3Constants.WEB3_CONNECT,
            web3,
            account
        });

        dispatch(instantiateLUSContracts());
        dispatch(instantiateBUSDContracts());

        return web3;

    }


};

export const web3Disconnect = () => async (dispatch, getState) => {

    const state = getState();

    const { web3 } = state.web3;

    localStorage.removeItem("_acc");

    dispatch({
        type: web3Constants.WEB3_DISCONNECT,
        web3: null,
        account: null
    });

    dispatch({
        type: web3Constants.INIT_CONTRACT_BUSD,
        contractBusd: null,
        balance: 0
    });

    dispatch({
        type: web3Constants.INIT_CONTRACT_LUS,
        contractLus: null,
        balance: 0
    });

};

export const instantiateBUSDContracts = () => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    if (web3 && account) {

        let contractBUSD = new web3.eth.Contract(ERC20ABI, TOKEN_BUSD);

        let balance = 0;

        if (contractBUSD && account) {

            const balanceBigN = await contractBUSD.methods.balanceOf(account).call();

            balance = ethers.utils.formatEther(balanceBigN);

            balance = Math.round(balance * 100) / 100;

        }

        dispatch({
            type: web3Constants.INIT_CONTRACT_BUSD,
            contractBUSD,
            balance
        });

    }

};

export const instantiateLUSContracts = () => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    if (web3 && account) {

        let contractLUS = new web3.eth.Contract(ERC20ABI_MSP, TOKEN_MSP);

        let balance = 0;

        if (contractLUS && account) {

            const balanceBigN = await contractLUS.methods.balanceOf(account).call();

            balance = ethers.utils.formatEther(balanceBigN);

            balance = Math.round(balance * 100) / 100;

        }

        dispatch({
            type: web3Constants.INIT_CONTRACT_LUS,
            contractLUS,
            balance
        });

    }

};

export const fetchCurrentMSP = () => async (dispatch) => {

    try {

        // dispatch({ type: web3Constants.FETCH_CURRENT_MSP_REQUEST });

        //const url = "https://api.coingecko.com/api/v3/coins/binance-usd";
        const url = "https://api.coingecko.com/api/v3/coins/luna-rush";

        const response = await fetch(url);

        const json = await response.json();

        const { current_price } = json.market_data;

        let price = 0;
        let priceUSD = 0;

        // 1 MSP = ? USD
        // 22.222 MSP =>  1 USD

        if (current_price) {

            //priceUSD = formatCur(current_price["usd"]);
            priceUSD = 0.045;
            // price = 1 / priceUSD;

            price = 22.222; // 1 USD = 22.222 MSP

        }

        dispatch({
            type: web3Constants.FETCH_CURRENT_MSP_SUCCESS,
            priceUSD,
            price
        });

        return price;


    } catch (error) {
        dispatch({
            type: web3Constants.FETCH_CURRENT_MSP_ERROR,
            message: error
        });
    }
}

const formatCur = (value) => {
    return Math.round(value * 100) / 100;
}
