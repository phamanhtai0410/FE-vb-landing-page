import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnBorrow = ({ boxID }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const handlerSubmit = async () => {
        if (!isPending && boxID) {
            setIsPending(true);
            await dispatch(actions.borrowMarket(boxID)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }
    }

    return (<>
        {isPending ? <div> <Beforeunload onBeforeunload={(event) => event.preventDefault()} /> <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">  </svg></div> : ""}
        <button onClick={e => { handlerSubmit(e) }} className="btn-modal-veb bg-btn-veb" type="submit">

            {isPending ? "Pending..." : "Borrow"}
        </button>
    </>)
}

export default BtnBorrow;