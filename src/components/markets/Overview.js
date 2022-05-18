

import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import IcNet from '../../assets/images/ic_net.svg';
import IcDropdown from '../../assets/images/ic_dropdown.svg';


const Overview = () => {

    const { accountSupplyBalance, accountBorrowBalance } = useSelector(state => state.accountAssetsReducer, shallowEqual);

    return (

        <div className='font-poppins'>
            <h2 className='text-lg'>Overview</h2>
            <div className='bg-overview flex justify-center justify-items-center items-center text-center rounded mt-3 p-4'>

                {accountSupplyBalance || accountBorrowBalance ? <>
                    <div className='flex-1'>
                        <p className='text-xs font-normal text-slate-50'>Net APY</p>
                        <span className='text-xl font-bold'>4.57K %</span>
                    </div>|
                </> : ""}

                <div className='flex-1'>
                    <p className='text-xs font-normal text-slate-50'>Supply balance</p>
                    <span className='text-xl font-bold'>$ {accountSupplyBalance}</span>
                </div>
                |
                <div className='flex-1'>
                    <p className='text-xs font-normal text-slate-50'>Borrow balance</p>
                    <span className='text-xl font-bold'>$ {accountBorrowBalance}</span>
                </div>

                {accountSupplyBalance || accountBorrowBalance ? <>|<div className='flex-1'>
                    <p className='text-xs font-normal text-slate-50'>Health factor</p>
                    <span className='text-xl font-bold'>1.08</span>
                </div> </> : ""}

                {accountSupplyBalance || accountBorrowBalance ? <>|<div className='flex-1'>
                    <p className='text-xs font-normal text-slate-50'>Available rewards</p>
                    <span className='text-xl font-bold'>0 %</span>
                </div></> : ""}

            </div>
        </div>
    )

}

export default Overview;