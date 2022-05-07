import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';
import { marketplaceConstants } from '../../constants';

const BtnOpenBorrow = ({ assetsAddress }) => {

    const [isPending, setIsPending] = useState(false);

    const dispatch = useDispatch();

    const handlerOpenModal = async () => {

        if (!isPending && assetsAddress) {

            dispatch({
                type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
                data: {
                    assetsAddress
                }
            })

            // setIsPending(true);
            // await dispatch(actions.buyLUS(boxID)).then(() => {
            //     setIsPending(false);
            // }).catch((e) => {
            //     setIsPending(false);
            // });
        }
    }

    return (<>
        {isPending ? <Beforeunload onBeforeunload={(event) => event.preventDefault()} /> : ""}
        <button onClick={e => { handlerOpenModal(e) }} className="btn-veb h-10" type="submit">{isPending ? "Pending..." : "Borrow"} </button>
    </>)
}

export default BtnOpenBorrow;