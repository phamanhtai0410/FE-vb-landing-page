
import { ethers } from 'ethers';
import Connex from '@vechain/connex';

import { Certificate, blake2b256, secp256k1 } from 'thor-devkit';

import { alertActions } from './alert.actions';
import { web3Constants } from '../constants';
import getWeb3 from '../utils/getWeb3';

import ERC20ABI from '../_contracts/abi-erc20.json';
import ERC20ABI_MSP from '../_contracts/MSP.json';


// VET : dung de staking duy tri he thong
// VTH0 : dung de tra vi chay smart Contract

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

async function checkConected(connex, certid) {

    connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
            type: 'text',
            content: 'random generated string'
        }
    })
        .link(`https://connex.vecha.in/${certid}`) // User will be back to the app by the url https://connex.vecha.in/0xffff....
        .request()
        .then(result => {

            return result;
        })


}



export const web3Connect = (isLogin) => async (dispatch) => {

    const web3 = await getWeb3();

    const PK = "Kocanbiet082429!@#"

    let signer;
    let _acc = localStorage.getItem('_acc');
    let _sign = localStorage.getItem('_sign');

    const connex = new Connex({
        node: 'https://testnet.veblocks.net/',
        network: 'test'
    })


    if (_acc && _sign) {
        dispatch({
            type: web3Constants.WEB3_CONNECT,
            web3,
            signer: JSON.parse(_sign),
            account: _acc
        });
        return _acc;
    }

    if (!_acc && isLogin) {
        // Ask user to sign the agreement
        signer = await connex.vendor.sign('cert', {
            purpose: 'agreement',
            payload: {
                type: 'text',
                content: 'agreement'
            }
        }).request();

        _acc = signer.annex.signer;
        _sign = JSON.stringify(signer);

        // console.log(blake2b256(jsonStr))
        // const signature = secp256k1.sign(blake2b256(jsonStr), PK);
        //sconsole.log("signature", blake2b256(jsonStr).toString('hex'));

        localStorage.setItem('_acc', _acc);
        localStorage.setItem('_sign', _sign);

        dispatch({
            type: web3Constants.WEB3_CONNECT,
            web3,
            signer,
            account: _acc
        });

    } else {



        // const recoveredAddress = await web3.eth.accounts.recover('agreement', _sign);
        // if (recoveredAddress) {
        //     dispatch({
        //         type: web3Constants.WEB3_CONNECT,
        //         web3,
        //         signer: _acc,
        //         account: signer.annex.signer
        //     });
        // }

        //const sign = web3.eth.accounts.sign('agreement', _sign);
        // const acc = connex.thor.account(_acc);

        // acc.get().then(accInfo => {
        //     console.log(accInfo)
        // });

        // acc.getCode().then(code => {
        //     console.log("code", code)
        // });

        // // 3: check results, compare both address
        // if (web3.utils.toChecksumAddress(recoveredAddress) === _acc) {
        //     console.log('SUCCESS');
        // } else {
        //     console.log('FAILED');
        // }

        // const signCert = checkConected(connex, _sign);
        // console.log(signCert)
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
