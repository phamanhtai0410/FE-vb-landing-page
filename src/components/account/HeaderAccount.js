
import React from 'react';

import BalanceVB from './BalanceVB';
import BtnConnect from './BtnConnect';

const HeaderAccount = () => {

    return (

        <div className="hidden lg:flex flex-wrap items-center justify-between ">
            <div className="flex flex-row justify-center items-center my-auto space-x-2">
                <BalanceVB />
                <BtnConnect />
            </div>
        </div>

    );


}
export default HeaderAccount;

