import React, {useEffect, useState} from 'react';
import {shallowEqual, useDispatch, useSelector} from "react-redux";
import {CSSTransition, TransitionGroup} from "react-transition-group";
import IcDropdown from "../../assets/images/ic_down_asset.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";
import StakingRowAction from "./StakingRowAction";

const DATA_SAMPLE = [
    {
        iconStake: IcVeBank,
        assetStakeName: "VB",
        assetPoolAddress: process.env.REACT_APP_TOKEN_VEBANK,
        assetDecimals: 18,
        pendingReward: "0",
        staked: "0",
        apr: "15.5",
        totalStaked: {
            usd: "36,000,000",
            vB: "20,000,000",
        },
    },
]

const AssetsStaking = () => {
    const [openRowAssets, setOpenRowAssets] = useState([]);

    const dispatch = useDispatch();

    const {web3} = useSelector(state => state.web3, shallowEqual);

    const onClickShowRowAssets = (assetsAddress) => {

        const listShowChecked = [...openRowAssets];
        const indexShow = openRowAssets.indexOf(assetsAddress);

        if (indexShow === -1) {
            listShowChecked.push(assetsAddress);
        } else {
            listShowChecked.splice(indexShow, 1);
        }

        setOpenRowAssets(listShowChecked);

    }

    const checkShowDown = (assetsAddress) => {
        return !(openRowAssets.indexOf(assetsAddress) === -1);
    }


    const showListAsset = (dataList) => {

        if (dataList && dataList.length > 0) {

            return dataList.map((item) =>

                <CSSTransition
                    key={item.assetsAddress}
                    timeout={500}
                    classNames="item_asset"
                >
                    <div className="border border-[#0FE3E3] rounded">
                        <div
                            className="bg-[#182844] justify-items-center content-around font-poppins text-base rounded cursor-pointer"
                            onClick={e => onClickShowRowAssets(item.assetsPoolAddress)}>

                            <div className="grid grid-cols-12 pt-2 text-[#678BCA]">
                                <div className="col-span-3"/>
                                <div className="col-span-2 flex justify-center items-center text-sm">
                                    Pending Rewards
                                </div>
                                <div className="col-span-2 flex justify-center items-center text-sm">
                                   Staked
                                </div>
                                <div className="col-span-2 flex justify-center items-center text-sm">
                                   APR
                                </div>
                                <div className="col-span-2 flex justify-center items-center text-sm">
                                   Total Staked
                                </div>
                                <div className="col-span-1"/>
                            </div>
                            <div className="grid grid-cols-12 py-2">
                                <div
                                    className="col-span-3 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        <img className="inline-block h-8 w-8 rounded-full" src={item.iconStake} alt=""/>
                                    </div>
                                    <span className="text-lg font-semibold text-left w-28">{item.assetStakeName}</span>
                                </div>

                                <div className="col-span-2 flex justify-center items-center font-semibold text-[#3EE8FF]">
                                    {item.pendingReward} {item.assetStakeName}
                                </div>

                                <div className="col-span-2 flex justify-center items-center font-semibold text-[#3EE8FF]">
                                    {item.staked} {item.assetStakeName}
                                </div>

                                <div className="col-span-2 flex justify-center items-center font-semibold text-[#3EE8FF]">
                                    {item.apr}%
                                </div>

                                <div className="col-span-2 flex flex-col justify-center items-center">
                                    <div className="font-semibold text-[#3EE8FF]">
                                        ~${item.totalStaked.usd}
                                    </div>
                                    <div className="text-sm text-[#678BCA]">{item.totalStaked.vB} {item.assetStakeName}</div>
                                </div>

                                <div className="col-span-1 flex flex-col justify-center items-center cursor-pointer">
                                    <img
                                        className={`w-4 h-4 transition-transform delay-350 ${checkShowDown(item.assetsPoolAddress) ? 'rotate-180' : ""}`}
                                        src={IcDropdown} alt=""/>
                                </div>
                            </div>

                        </div>

                        <StakingRowAction key={item.assetsPoolAddress + '_act'} openRowAssets={openRowAssets} item={item}/>

                    </div>

                </CSSTransition>
            );
        }

    }

    useEffect(() => {
        if (web3) {
            // fetchMarketAssets();
        }
    }, [web3]);

    return (

        <div className="w-full min-h-max rounded-lg bg-[#0b1329] mt-10 p-10 fade-in-box">

            <h4 className="font-montserrat text-[20px] leading-9 text-[#3FDCA5]">Staking</h4>

            <div className="tbl-veb mt-8">
                <TransitionGroup>
                    {showListAsset(DATA_SAMPLE)}
                </TransitionGroup>
            </div>

        </div>
    )
};

export default AssetsStaking;
