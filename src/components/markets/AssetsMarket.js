

import IcCoin from '../../assets/images/ic_logo.svg';

import { TransitionGroup, CSSTransition } from 'react-transition-group';

import IcVeUSD from '../../assets/images/ic_veusd.svg';
import IcVeChain from '../../assets/images/ic_vechain.svg';
import IcVeBank from '../../assets/images/ic_vebank.svg';
import IcVtho from '../../assets/images/ic_vtho.svg';

import IcDropdown from '../../assets/images/ic_dropdown.svg';

import BtnOpenBorrow from './BtnOpenBorrow';
import BtnOpenWithdraw from './BtnOpenWithdraw';
import BtnOpenSupply from './BtnOpenSupply';
import BtnOpenRepay from './BtnOpenRepay';
import ModalSupply from '../supply/ModalSupply';
import ModalBorrow from '../borrows/ModalBorrow';

const AssetsMarket = () => {

    const listAsset = [
        {
            icon: IcVeChain,
            assetsChain: "VET",
            assetsAddress: "0x44B5ff695A0343A5c2401E7b97AfDb92395F102A",
            totalSupplied: "200.50",
            supplyAPY: "4.03",
            interestSupply: "1.8",
            borrowAPY: "4.03 %",
            interestBorrow: "1.8",
            totalBorrowed: "200.50",
        },
        {
            icon: IcVeUSD,
            assetsChain: "VEUSD",
            assetsAddress: "0xf8D11abFe2085e52b2B3A750EE89CF7EB5cc29Bd",
            totalSupplied: "200.50",
            supplyAPY: "4.03",
            interestSupply: "1.8",
            borrowAPY: "4.03 %",
            interestBorrow: "1.8",
            totalBorrowed: "200.50",
        },
        {
            icon: IcVtho,
            assetsChain: "VTHO",
            assetsAddress: "0x0000000000000000000000000000456e65726779",
            totalSupplied: "200.50",
            supplyAPY: "4.03",
            interestSupply: "1.8",
            borrowAPY: "4.03 %",
            interestBorrow: "1.8",
            totalBorrowed: "200.50",
        },
        {
            icon: IcVeBank,
            assetsChain: "VB",
            assetsAddress: "0x0fa8DC6200255Fc3382CDDb4B5358d7713D99c8d",
            totalSupplied: "200.50",
            supplyAPY: "4.03",
            interestSupply: "1.8",
            borrowAPY: "4.03 %",
            interestBorrow: "1.8",
            totalBorrowed: "200.50",
        }
    ]

    const showListAsset = (dataList) => {

        if (dataList && dataList.length > 0) {

            return dataList.map((item) =>

                <CSSTransition
                    key={item._id}
                    timeout={500}
                    classNames="item_asset"
                >
                    <div>

                        <div className="grid grid-cols-6 gap-6 mt-6 bg-[#182844] justify-items-center content-around font-poppins text-lg rounded">

                            <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                                <img className="w-6 h-6" src={item.icon} />
                                <span className="text-lg font-semibold w-12 text-left">{item.assetsChain}</span>
                            </div>

                            <div className="p-2 flex justify-center items-center font-semibold">{item.totalSupplied} M</div>

                            <div className="p-2 flex flex-col justify-center items-center content-center">
                                <div className="text-lg font-semibold">{item.supplyAPY} %</div>
                                <div className="border-2 border-solid border-[#363564] p-1">
                                    <div className="flex flex-row justify-start items-center space-x-2" >
                                        <span className="font-light text-sm">{item.interestSupply} %</span>
                                        <img className="w-4 h-4" src={IcVeBank} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 flex justify-center items-center font-semibold">{item.totalBorrowed} M</div>

                            <div className="p-2 flex flex-col justify-center items-center content-center">
                                <div className="text-lg font-semibold">{item.borrowAPY} %</div>
                                <div className="border-2 border-solid border-[#363564] p-1">
                                    <div className="flex flex-row justify-start items-center space-x-2" >
                                        <span className="font-light text-sm">{item.interestBorrow} %</span>
                                        <img className="w-4 h-4" src={IcVeBank} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-2 flex justify-center items-center">
                                <img className="w-3 h-3" src={IcDropdown} />
                                {/* <BtnOpenBorrow id={"BUSD"} /> */}
                            </div>

                        </div>

                        {showRowAction(item)}

                    </div>


                </CSSTransition>
            );
        }

    }

    const showRowAction = ({ assetsAddress }) => {

        console.log("showRowAction", assetsAddress)

        return (

            <div className='bg-[#182844] p-4 mt-2 flex flex-row justify-between rounded space-x-4' >

                <div className='bg-[#26355A] p-4 rounded'>
                    <h4>Earn</h4>
                    <div className='flex flex-row mt-3'>
                        <input
                            className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                            type="text"
                            placeholder={"0"}
                        />
                        <BtnOpenWithdraw assetsAddress={assetsAddress} />
                    </div>
                </div>

                <div className='bg-[#26355A] p-4 rounded '>
                    <h4>Balance</h4>
                    <div className='flex flex-row mt-3'>
                        <input
                            className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                            type="text"
                            placeholder={"0"}
                        />
                        <BtnOpenSupply assetsAddress={assetsAddress} />
                    </div>
                </div>

                <div className='bg-[#26355A] p-4 rounded'>
                    <h4>Debt</h4>
                    <div className='flex flex-row mt-3'>
                        <input
                            className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                            type="text"
                            placeholder={"0"}
                        />
                        <BtnOpenRepay />
                    </div>
                </div>

                <div className='bg-[#26355A] p-4 rounded'>
                    <h4>Balance</h4>
                    <div className='flex flex-row mt-3'>
                        <input
                            className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                            type="text"
                            placeholder={"0"}
                        />
                        <BtnOpenBorrow assetsAddress={assetsAddress} />
                    </div>
                </div>

            </div>

        )

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

                <TransitionGroup >
                    {showListAsset(listAsset)}
                </TransitionGroup>

            </div>
            <ModalSupply />
            <ModalBorrow />

        </div>
    )

}

export default AssetsMarket;