
import { useEffect, useState } from 'react';

import { useSelector, useDispatch, shallowEqual } from "react-redux";

import IcVB from '../../assets/images/ic_vebank.svg';

import { numberWithCommas } from '../../utils/lib';

const BalanceVET = () => {

    const { balanceVET } = useSelector(state => state.contractVET, shallowEqual);

    return (

        <div className="flex flex-row justify-start items-center space-x-2">
            {/* <img className="w-6 h-6" src={IcVB} alt="Coin VeBank" /> */}
            <span className="font-poppins font-medium text-slate-50 text-base">VET {balanceVET ? balanceVET : 0}</span>
        </div>
    )
}

export default BalanceVET;