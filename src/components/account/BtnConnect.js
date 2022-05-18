import { useState } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import * as actions from '../../actions';
import IcLogout from '../../assets/images/ic_logout.svg';
import IcWallet from '../../assets/images/ic_wallet.svg';

const BtnConnect = () => {

    const [isConnecting, setIsConnecting] = useState(false);

    const { account } = useSelector(state => state.web3, shallowEqual);

    const dispatch = useDispatch();

    const connectWalletHandler = async () => {
        if (!isConnecting) {
            setIsConnecting(true)
            await dispatch(actions.web3Connect(true)).then(() => {
                setIsConnecting(false)
            }).catch((e) => {
                setIsConnecting(false)
            });
        }
    }


    const disConnectWallet = async () => {
        await dispatch(actions.web3Disconnect())
    }

    return (
        <>

            {account ?

                <>
                    <button
                        className="flex flex-row items-center justify-center border-2 border-solid border-[#2A9F89] rounded-full bg-transparent px-4 py-[10px] font-poppins text-sm leading-5"
                        type="submit">
                        <img className='mr-[10px] w-4 h-4' src={IcWallet} alt="icon Wallet" />
                        {`${account.slice(0, 6)}...${account.slice(
                            account.length - 4,
                            account.length
                        )}`}

                    </button>

                    <button onClick={disConnectWallet} className='rounded-full border-2 border-solid border-[#2A9F89]'>
                        <img className='p-[10px] w-10 h-10' src={IcLogout} alt="icon logout" />
                    </button>

                </>

                : <button
                    onClick={connectWalletHandler}
                    className="btn-connect-wallet px-6 py-3"
                    type="submit">
                    {isConnecting ? "Connecting..." : "Connect to a wallet"}
                </button>
            }
        </>
    )
}

export default BtnConnect;