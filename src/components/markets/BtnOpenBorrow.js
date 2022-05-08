import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import { marketplaceConstants } from '../../constants';
import * as actions from '../../actions';

const BtnOpenBorrow = (item) => {

    const [isPending, setIsPending] = useState(false);

    const dispatch = useDispatch();

    const handlerOpenModal = async () => {

        if (!isPending && item && item.assetsAddress) {

            dispatch({
                type: marketplaceConstants.MODAL_OPEN_BORROW_MARKET,
                data: {
                    ...item
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