import { useState } from 'react';
import { useDispatch } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

const BtnBorrow = ({ amount, pending }) => {

    const [isPending, setIsPending] = useState(false);
    const dispatch = useDispatch();

    const handlerSubmit = async () => {

        if (isPending === false && amount) {
            setIsPending(true);
            await dispatch(actions.borrowMarket(amount)).then(() => {
                setIsPending(false);
            }).catch((e) => {
                setIsPending(false);
            });
        }
    }

    return (<>
        {isPending ? <Beforeunload onBeforeunload={(event) => event.preventDefault()} /> : ""}

        <button onClick={e => { handlerSubmit(e) }} disabled={pending} className={`btn-modal-veb ${pending ? "bg-btn-veb-disabled" : "bg-btn-veb"}`} type="submit">
            {isPending ? "Pending..." : "Borrow"}
        </button>
    </>)
}

export default BtnBorrow;