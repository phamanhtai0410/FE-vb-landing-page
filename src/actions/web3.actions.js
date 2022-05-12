
import { ethers } from "@vechain/ethers";
import Connex from '@vechain/connex';

import { Certificate, blake2b256, secp256k1 } from 'thor-devkit';

import { alertActions } from './alert.actions';
import { web3Constants, destroyConstants, marketplaceConstants } from '../constants';
import getWeb3 from '../utils/getWeb3';


import ERC20ABI_VB from '../_contracts/VB.json';
import ERC20ABI_AAVE from '../_contracts/AaveProtocolDataProvider.json';


// VET : dung de staking duy tri he thong
// VTH0 : dung de tra vi chay smart Contract

const TOKEN_AAVE = "0x4964b481dF13471f89781b09550484E82466352C";
const TOKEN_VEBANK = process.env.REACT_APP_TOKEN_VEBANK;
const TOKEN_WVET = process.env.REACT_APP_TOKEN_WVET; //WVET(Wrapped VET)

const ADDRESS_PROTOCOL = process.env.REACT_APP_ADDRESS_PROTOCOL; // AaveProtoco

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

async function checkConected(connex, certid) {

    connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
            type: 'text',
            content: 'random generated string'
        }
    }).link(`https://connex.vecha.in/${certid}`) // User will be back to the app by the url https://connex.vecha.in/0xffff....
        .request()
        .then(result => {

            return result;
        })


}

export const web3Connect = (isLogin) => async (dispatch) => {

    const web3 = await getWeb3();
    const PK = "Kocanbiet082429!@#";

    let signer;
    let _acc = localStorage.getItem('_acc');
    let _sign = localStorage.getItem('_sign');

    const connex = new Connex({
        node: 'https://testnet.veblocks.net/',
        network: 'test'
    })

    if (_acc && _sign) {

        // console.log("_acc && _sign");
        dispatch({
            type: web3Constants.WEB3_CONNECT,
            web3,
            connex,
            signer: JSON.parse(_sign),
            account: _acc
        });

    }

    if (!_acc && isLogin) {

        // Ask user to sign the agreement
        connex.vendor.sign('cert', {
            purpose: 'agreement',
            payload: {
                type: 'text',
                content: 'agreement'
            }
        }).request().then((signer) => {
            _acc = signer.annex.signer;
            _sign = JSON.stringify(signer);

            localStorage.setItem('_acc', _acc);
            localStorage.setItem('_sign', _sign);

            dispatch({
                type: web3Constants.WEB3_CONNECT,
                connex,
                web3,
                signer,
                account: _acc
            });

        });

    }

    return _acc;

};

export const web3Disconnect = () => async (dispatch, getState) => {

    const state = getState();

    const { web3 } = state.web3;

    localStorage.removeItem("_acc");
    localStorage.removeItem("_sign");

    dispatch({
        type: web3Constants.WEB3_DISCONNECT,
        connex: null,
        web3: null,
        account: null
    });

    // setTimeout(() => {
    //     dispatch({ type: destroyConstants.DESTROY_SESSION });
    // }, 1000);

};

export const instantiateVetContracts = () => async (dispatch, getState) => {

    const state = getState();

    const { connex, account } = state.web3;

    if (account) {

        const accInfo = await connex.thor.account(account).get();

        let balanceVET = 0;
        let balanceVTHO = 0;

        if (accInfo && accInfo.balance && accInfo.energy) {

            balanceVET = ethers.utils.formatEther(accInfo.balance);
            balanceVET = Math.round(balanceVET * 100) / 100;

            balanceVTHO = ethers.utils.formatEther(accInfo.energy);
            balanceVTHO = Math.round(balanceVTHO * 100) / 100;

        }

        dispatch({
            type: web3Constants.INIT_CONTRACT_VET,
            balanceVET,
            balanceVTHO
        });


        return accInfo;


    }

    dispatch({
        type: web3Constants.INIT_CONTRACT_VET,
        balanceVET: 0,
        balanceVTHO: 0
    });

};

export const instantiateVBContracts = () => async (dispatch, getState) => {

    const state = getState();

    const { web3, account } = state.web3;

    if (web3 && account) {

        let contractVB = new web3.eth.Contract(ERC20ABI_VB, TOKEN_VEBANK);

        let balance = 0;

        if (contractVB && account) {

            const balanceBigN = await contractVB.methods.balanceOf(account).call();
            balance = ethers.utils.formatEther(balanceBigN);
            balance = Math.round(balance * 100) / 100;

        }

        dispatch({
            type: web3Constants.INIT_CONTRACT_VB,
            contractVB,
            balance
        });

        return balance;

    }

    dispatch({
        type: web3Constants.INIT_CONTRACT_VB,
        contractVB: null,
        balance: 0
    });

};

export const getAccountAssets = () => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    const { data } = state.assetsMarketReducer;

    let dataUser = {
        accountSupplyBalance: 0,
        accountBorrowBalance: 0,
    }

    let dataList = [];

    if (web3 && account) {

        dispatch({
            type: marketplaceConstants.FETCH_ACCOUNT_ASSETS_REQUEST,
            query: {}
        });

        let contractAAVE = new web3.eth.Contract(ERC20ABI_AAVE, TOKEN_AAVE);

        if (contractAAVE && account) {

            for await (const item of data) {

                const accountReserve = await contractAAVE.methods.getUserReserveData(item.assetsAddress, account).call();

                let balanceSupply = 0;
                if (accountReserve.currentATokenBalance) {
                    balanceSupply = ethers.utils.formatEther(accountReserve.currentATokenBalance);
                    balanceSupply = Math.round(balanceSupply * 100) / 100;
                    dataUser.accountSupplyBalance = dataUser.accountSupplyBalance + Number(balanceSupply)
                }

                let balanceBorrow = 0;
                if (accountReserve.currentStableDebt || accountReserve.currentVariableDebt) {

                    const currentStableDebt = ethers.utils.formatEther(accountReserve.currentStableDebt || '0');
                    const currentVariableDebt = ethers.utils.formatEther(accountReserve.currentVariableDebt || '0');

                    balanceBorrow = Number(currentStableDebt) + Number(currentVariableDebt);
                    balanceBorrow = Math.round((balanceBorrow) * 100) / 100;

                    dataUser.accountBorrowBalance = dataUser.accountBorrowBalance + Number(balanceBorrow);

                }

                if (balanceSupply || balanceBorrow) {

                    dataList.push({
                        ...item,
                        totalSupplied: balanceSupply,
                        totalBorrowed: balanceBorrow,
                    })

                }

            }

            dataUser.accountSupplyBalance = Number(dataUser.accountSupplyBalance.toFixed(2));
            dataUser.accountBorrowBalance = Number(dataUser.accountBorrowBalance.toFixed(2));

        }

        dispatch({
            type: marketplaceConstants.FETCH_ACCOUNT_ASSETS_SUCCESS,
            contractAAVE,
            ...dataUser,
            data: dataList
        });

    } else {

        dispatch({
            type: marketplaceConstants.FETCH_ACCOUNT_ASSETS_SUCCESS,
            accountSupplyBalance: 0,
            accountBorrowBalance: 0,
            ...dataUser,
            data: dataList
        });
    }

    return dataList;

};

export const getMarketAssets = () => async (dispatch, getState) => {

    const state = getState();

    const { web3 } = state.web3;
    const { data } = state.assetsMarketReducer;

    let dataTotal = {
        totalSupply: 0,
        totalBorrow: 0
    }

    let dataList = [];

    if (web3 && TOKEN_AAVE && data.length > 0) {

        let contractAAVE = new web3.eth.Contract(ERC20ABI_AAVE, TOKEN_AAVE);

        for await (const item of data) {

            const getReserveData = await contractAAVE.methods.getReserveData(item.assetsAddress).call();

            const dataConfig = await contractAAVE.methods.getReserveConfigurationData(item.assetsAddress).call();
            console.log(dataConfig);

            let balanceSupply = 0;
            if (getReserveData.totalAToken) {
                balanceSupply = ethers.utils.formatEther(getReserveData.totalAToken);
                balanceSupply = Math.round(balanceSupply * 100) / 100;
                dataTotal.totalSupply = dataTotal.totalSupply + Number(balanceSupply);
            }

            let balanceBorrow = 0;
            if (getReserveData.totalStableDebt || getReserveData.totalVariableDebt) {

                const totalStableDebt = ethers.utils.formatEther(getReserveData.totalStableDebt || '0');
                const totalVariableDebt = ethers.utils.formatEther(getReserveData.totalVariableDebt || '0');

                balanceBorrow = Number(totalStableDebt) + Number(totalVariableDebt);
                balanceBorrow = Math.round((balanceBorrow) * 100) / 100;

                dataTotal.totalBorrow = dataTotal.totalBorrow + Number(balanceBorrow);

            }

            dataList.push({
                ...item,
                totalSupplied: balanceSupply,
                totalBorrowed: balanceBorrow,
            })

        }

        dataTotal.totalBorrow = dataTotal.totalBorrow.toFixed(2)
        dataTotal.totalSupply = dataTotal.totalSupply.toFixed(2)

        dispatch({
            type: marketplaceConstants.FETCH_ASSETS_MARKET_SUCCESS,
            ...dataTotal,
            contractAAVE,
            data: dataList
        });



    } else {
        dispatch({
            type: marketplaceConstants.FETCH_ASSETS_MARKET_SUCCESS,
            ...dataTotal,
            data: dataList
        });
    }

    return dataList;

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


export const reloadAccountAssets = (addressAsset) => async (dispatch, getState) => {

    const state = getState();
    const { web3, account } = state.web3;

    if (web3 && account) {

        await dispatch(instantiateVetContracts());
        await dispatch(instantiateVBContracts());

        await dispatch(getMarketAssets());
        await dispatch(getAccountAssets());


    }

};





const formatCur = (value) => {
    return Math.round(value * 100) / 100;
}
