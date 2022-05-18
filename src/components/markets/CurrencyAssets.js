
import { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from "react-redux";
import { NavLink, useLocation } from 'react-router-dom';

import IcSearch from '../../assets/images/ic_search.png';

const CurrencyAssets = ({ currencyBalance, assetsAddress }) => {

    const location = useLocation();
    const [keyHash, setKeyHash] = useState("usd");

    const dataPrice = useSelector(state => state.assetsPriceReducer.data, shallowEqual);

    useEffect(() => {
        if (location.hash === "#usd") {
            setKeyHash(location.hash);
        } else if (location.hash === "#native") {
            setKeyHash(location.hash);
        } else {
            setKeyHash("#usd");
        }
    }, [location]);

    if (!currencyBalance) {
        return "-"
    }

    return (
        <>
            {keyHash === "#usd" && dataPrice ? <>$ {(currencyBalance * dataPrice[assetsAddress]).toFixed(2)}</> : currencyBalance}
        </>
    )
}

export default CurrencyAssets;