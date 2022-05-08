import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';

const BtnOpenSupply = ({ item }) => {

    const dispatch = useDispatch();

    const handlerOpenModal = async () => {

        if (item && item.assetsAddress) {

            dispatch(actions.loadModalSupply(item))

            // dispatch({
            //     type: marketplaceConstants.MODAL_OPEN_SUPPLY_MARKET,
            //     data: {
            //         ...item
            //     }
            // })

            // setIsPending(true);
            // await dispatch(actions.buyLUS(boxID)).then(() => {
            //     setIsPending(false);
            // }).catch((e) => {
            //     setIsPending(false);
            // });

        }
    }

    return (<>
        <button onClick={e => { handlerOpenModal(e) }} className="btn-veb h-10" type="submit">Supply </button>
    </>)
}

export default BtnOpenSupply;