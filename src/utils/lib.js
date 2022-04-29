
import { ethers } from 'ethers';
var CryptoJS = require("crypto-js");

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function formatNumberEther(amount) {
    const amountN = Number(ethers.utils.formatEther(amount, { commify: true }));
    return numberWithCommas(Math.round(amountN * 100) / 100);
}

export function formatUriSecure(url) {

    const currentDate = new Date()
    const secureKey = process.env.REACT_APP_SECURE_KEY;
    const secureTime = process.env.REACT_APP_SECURE_TIME;

    let expireTime = (currentDate.getTime() / 1000) + Number(secureTime);
    expireTime = Math.round(expireTime);

    let secure_link = `${secureKey}${expireTime}${url}`;
    secure_link = CryptoJS.MD5(secure_link, "binary").toString(CryptoJS.enc.Base64);
    secure_link = secure_link.replaceAll("+", "-");
    secure_link = secure_link.replaceAll("/", "_");
    secure_link = secure_link.replace(/=/g, "");

    return url + `?st=${secure_link}&e=${expireTime}`;

}


