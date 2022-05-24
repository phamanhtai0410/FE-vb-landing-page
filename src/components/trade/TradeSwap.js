import React, {useEffect, useState} from 'react';
import IcSwap from "../../assets/images/ic_swap.svg";
import IcDropDown from "../../assets/images/ic_dropdown.svg";

const TradeSwap = ({coinType, getSwapToken}) => {

    const [swapToken, setSwapToken] = useState({
        from: {
            symbol: coinType[0].symbol,
            icon: coinType[0].icon,
            price: coinType[0].price
        },
        to: {
            symbol: coinType[1].symbol,
            icon: coinType[1].icon,
            price: coinType[1].price
        }
    });

    const handleChangeTokenSwap = () => {
        setSwapToken({
            from: {
                symbol: swapToken.to.symbol,
                icon: swapToken.to.icon,
                price: swapToken.to.price
            },
            to: {
                symbol: swapToken.from.symbol,
                icon: swapToken.from.icon,
                price: swapToken.from.price
            }
        });
    }

    useEffect(() => {
        getSwapToken(swapToken);
    }, [swapToken]);

    return (
        <div className="flex flex-col p-2 space-y-4">
            <div className="flex justify-between w-full">
                <h2 className="font-bold">Swap</h2>
                <div className="flex space-x-2">
                    <h2>
                        reload
                    </h2>
                    <h2>
                        setting
                    </h2>
                </div>
            </div>

            {/* From section */}
            <div className="bg-[#182844] rounded-md p-4 space-y-4">
                <div className="flex space-x-3">
                    <img className="w-6" src={swapToken.from.icon} alt=""/>
                    <h1 className="font-bold">{swapToken.from.symbol}</h1>
                    <img src={IcDropDown} alt=""/>
                </div>
                <input
                    className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base w-full"
                    type="text"
                    placeholder="0.0"
                />
                <div className="flex justify-center items-center space-x-2">
                    <div className="w-1/4">
                        <div className="bg-white bg-opacity-10 flex justify-center items-center rounded-md">
                            25%
                        </div>
                    </div>
                    <div className="w-1/4">
                        <div className="bg-white bg-opacity-10 flex justify-center items-center rounded-md">
                            50%
                        </div>
                    </div>
                    <div className="w-1/4">
                        <div className="bg-white bg-opacity-10 flex justify-center items-center rounded-md">
                            75%
                        </div>
                    </div>
                    <div className="w-1/4">
                        <div className="bg-white bg-opacity-10 flex justify-center items-center rounded-md">
                            100%
                        </div>
                    </div>
                </div>
            </div>

            {/* Swap button */}
            <div className="flex justify-center items-center">
                <img className="cursor-pointer" src={IcSwap} alt="" onClick={handleChangeTokenSwap}/>
            </div>

            {/* To section */}
            <div className="bg-[#182844] rounded-md p-4 space-y-4">
                <div className="flex space-x-3">
                    <img className="w-6" src={swapToken.to.icon} alt=""/>
                    <h1 className="font-bold">{swapToken.to.symbol}</h1>
                    <img src={IcDropDown} alt=""/>
                </div>
                <input
                    className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base w-full"
                    type="text"
                    placeholder="0.0"
                />
            </div>

            {/* Note section */}
            <div className="flex justify-between items-center px-4 text-sm">
                <h1>1 {swapToken.from.symbol} = {(swapToken.from.price / swapToken.to.price).toFixed(2)} {swapToken.to.symbol}</h1>
                <img className="rotate-90 cursor-pointer" src={IcSwap} alt="" onClick={handleChangeTokenSwap}/>
            </div>
            <div className="flex justify-between items-center px-4 text-sm">
                <h1 className="text-[#3ee8ff]">Slippage Tolerance</h1>
                <h2 className="text-[#a0d911]">0.5%</h2>
            </div>


            <div className="flex justify-center">
                <button className="btn-veb h-10 w-full">Connect Wallet</button>
            </div>
        </div>
    );
};

export default TradeSwap;
