
import React, { useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";

import * as actions from './actions';


const Wallet = () => {

    const { account } = useSelector(state => state.web3, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {

        if (window.ethereum && window.ethereum.isMetaMask) {

            window.ethereum.on('accountsChanged', accountChangeHandler);

            window.ethereum.on('chainChanged', chainChangeHandler);

        }

        const timer = setTimeout(() => {
            fetchWeb3Init(false);
        }, 1000);

        return () => clearTimeout(timer);

    }, []);

    async function fetchWeb3Init(loadDefault) {

       // await dispatch(actions.web3Connect(loadDefault));// true is account conected reload contract
        // await dispatch(actions.instantiateLUSContracts());
        // await dispatch(actions.instantiateBUSDContracts());

    }

    // async function loadAddNetwork() {
    //     await dispatch(actions.changeNetwork());
    // }

    async function accountChangeHandler(accounts) {

        if (accounts.length > 0) {

            if (account === null) {
                fetchWeb3Init(false)
            }

            // if (accounts[0] !== account && account) {
            //     await dispatch(actions.instantiateLUWAContracts());
            // }

        } else {
            await dispatch(actions.web3Disconnect());

        }
    }

    const chainChangeHandler = () => {
        window.location.reload()
    }

    return (
        <> </>
    );


}
export default Wallet;

