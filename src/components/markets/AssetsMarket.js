



import { useEffect, useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import IcVeUSD from '../../assets/images/ic_veusd.svg';
import IcVeChain from '../../assets/images/ic_vechain.svg';
import IcVeBank from '../../assets/images/ic_vebank.svg';
import IcVtho from '../../assets/images/ic_vtho.svg';

import IcDropdown from '../../assets/images/ic_dropdown.svg';

import ModalSupply from '../supply/ModalSupply';
import ModalBorrow from '../borrows/ModalBorrow';
import AssetsRowAction from './AssetsRowAction';

import * as actions from '../../actions';

const AssetsMarket = () => {

    const [openRowAssets, setOpenRowAssets] = useState([]);

    const dispatch = useDispatch();

    const { web3 } = useSelector(state => state.web3, shallowEqual);
    const { data } = useSelector(state => state.assetsMarketReducer, shallowEqual);

    useEffect(() => {
        if (web3) {
            fetchMarketAssets();
        }
    }, [web3]);

    async function fetchMarketAssets() {
        await dispatch(actions.getMarketAssets());
    }

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

    const showListAsset = (dataList) => {

        if (dataList && dataList.length > 0) {

            return dataList.map((item) =>

                <CSSTransition
                    key={item.assetsAddress}
                    timeout={500}
                    classNames="item_asset"
                >
                    <div>

                        <div className="grid grid-cols-6 gap-6 mt-6 bg-[#182844] justify-items-center content-around font-poppins text-lg rounded cursor-pointer" onClick={e => onClickShowRowAssets(item.assetsAddress)}>

                            <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                                <img className="w-6 h-6" src={item.icon} />
                                <span className="text-lg font-semibold w-12 text-left">{item.assetsChain}</span>
                            </div>

                            <div className="p-2 flex justify-center items-center font-semibold">$ {item.totalSupplied}</div>

                            <div className="p-2 flex flex-col justify-center items-center content-center">
                                <div className="text-lg font-semibold">{item.supplyAPY} %</div>
                                <div className="border-2 border-solid border-[#4F92A7] p-1">
                                    <div className="flex flex-row justify-start items-center space-x-2" >
                                        <span className="font-light text-sm">{item.interestSupply} %</span>
                                        <img className="w-4 h-4" src={IcVeBank} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 flex justify-center items-center font-semibold">$ {item.totalBorrowed}</div>

                            <div className="p-2 flex flex-col justify-center items-center content-center">
                                <div className="text-lg font-semibold">{item.borrowAPY} %</div>
                                <div className="border-2 border-solid border-[#4F92A7] p-1">
                                    <div className="flex flex-row justify-start items-center space-x-2" >
                                        <span className="font-light text-sm">{item.interestBorrow} %</span>
                                        <img className="w-4 h-4" src={IcVeBank} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 flex justify-center items-center cursor-pointer" >
                                <img className="w-3 h-3" src={IcDropdown} />
                            </div>

                        </div>

                        <AssetsRowAction key={item.assetsAddress + '_act'} openRowAssets={openRowAssets} item={item} />

                        {/* {showRowAction(item)} */}

                    </div>


                </CSSTransition>
            );
        }

    }

    return (

        <div className="w-full min-h-max rounded-lg bg-[#0b1329] mt-16 p-10 fade-in-box">

            <h4 className="font-montserrat text-[30px] leading-9">Vechain assets</h4>

            {/* 
                <div className="p-3 mt-5">

                    <div className="p-2 flex flex-row justify-start items-center space-x-4 w-full text-right cursor-pointer bg-[#1B1A43]">
                        <img className="w-6 h-6" src={IcWarning} />
                        <span className="text-lg font-poppins text-xs">To borrow you need to supply any asset to be used as collateral.</span>
                    </div>

                </div>
            */}

            <div className="tbl-veb mt-8">

                <div className="grid grid-cols-6 gap-6 justify-items-center content-around">
                    <div className="px-2 py-2">Assets</div>
                    <div className="px-2 py-2">Total supplied</div>
                    <div className="px-2 py-2">Supply APY</div>
                    <div className="px-2 py-2">Total borrowed</div>
                    <div className="px-2 py-2">Borrow APY</div>
                    <div className=''></div>
                </div>

                <TransitionGroup>
                    {showListAsset(data)}
                </TransitionGroup>

            </div>
            <ModalSupply />
            <ModalBorrow />

        </div>
    )

}

export default AssetsMarket;