import React from 'react';
import BtnOpenHarvest from "./BtnOpenHarvest";
import BtnOpenAddLiquidity from "./BtnOpenAddLiquidity";
import BtnOpenUnstake from "./BtnOpenUnstake";
import {shallowEqual, useSelector} from "react-redux";
import BtnConnectInPage from "../account/BtnConnectInPage";

const StakingRowAction = ({openRowAssets, item}) => {

    const { account } = useSelector(state => state.web3, shallowEqual);

    if (openRowAssets.indexOf(item.assetsPoolAddress) === -1) {
        return <></>;
    }

    return (

        <div className='bg-[#182844] p-6 mt-2 fade-in-box flex flex-col lg:flex-row'>
            <div className="w-full lg:w-1/2 p-4">
                <div className='bg-[#26355A] p-6 rounded flex justify-between rounded space-x-4'>
                    <div>
                        <label className='font-poppins text-[14px] text-[#678BCA]'>Pending Rewards</label>
                        <div className='font-montserrat text-[16px] text-[#3EE8FF]'>0 VB</div>
                    </div>
                    <div className='flex flex-col justify-center items-center'>
                        {
                            account
                                ?
                                <BtnOpenHarvest item={item} />
                                :
                                <BtnConnectInPage />
                        }
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 p-4">
                <div className='bg-[#26355A] p-6 rounded flex justify-between rounded space-x-4'>
                    <div>
                        <label className='font-poppins text-[14px] text-[#678BCA]'>Start Staking</label>
                        <div className='font-montserrat text-[16px] text-[#3EE8FF]'>0 VB</div>
                    </div>
                    <div className='flex flex-row justify-end items-center w-2/3 space-x-2'>
                        {
                            account
                                ?
                                <>
                                    <BtnOpenUnstake item={item} />
                                    <BtnOpenAddLiquidity item={item} />
                                </>
                                :
                                <BtnConnectInPage />
                        }
                    </div>
                </div>
            </div>
        </div>

    )
};

export default StakingRowAction;
