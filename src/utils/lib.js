import { ethers } from "ethers";
var CryptoJS = require("crypto-js");

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getDeadline = () => Math.round(new Date().getTime() / 1000) + 3600;

export const getTimeStamp = () => new Date().getTime().toString();

export function formatNumberEther(amount) {
  const amountN = Number(ethers.utils.formatEther(amount, { commify: true }));
  return numberWithCommas(Math.round(amountN * 100) / 100);
}

export function formatUriSecure(url) {
  const currentDate = new Date();
  const secureKey = process.env.REACT_APP_SECURE_KEY;
  const secureTime = process.env.REACT_APP_SECURE_TIME;

  let expireTime = currentDate.getTime() / 1000 + Number(secureTime);
  expireTime = Math.round(expireTime);

  let secure_link = `${secureKey}${expireTime}${url}`;
  secure_link = CryptoJS.MD5(secure_link, "binary").toString(
    CryptoJS.enc.Base64
  );
  secure_link = secure_link.replaceAll("+", "-");
  secure_link = secure_link.replaceAll("/", "_");
  secure_link = secure_link.replace(/=/g, "");

  return url + `?st=${secure_link}&e=${expireTime}`;
}

export function nFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var i;
  for (i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

export const isContainVET = (...agrs) => {
  console.log("🐶🐶  ~ isContainVET ~ agrs", agrs);

  return [...agrs].includes(process.env.REACT_APP_TOKEN_WVET);
};

export const getDecimalForAsset = (assetsAddress) =>
  assetsAddress === process.env.REACT_APP_TOKEN_VEUSD ? 6 : 18;

export const getDecimalForAssetPair = (firstAssetAddress, secondAssetAddress) =>
  [firstAssetAddress, secondAssetAddress].includes(
    process.env.REACT_APP_TOKEN_VEUSD
  )
    ? 12
    : 18;

export async function copyTextToClipboard(text) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
