import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';

const BtnOpenWithdraw = ({ item }) => {

    const [disabledRule, setDisabledRule] = useState(false);
    const { data } = useSelector(state => state.accountAssetsReducer, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        checkRuleBtn(data);
    }, [data]);

    // Rule : có supply thì mới dc withdraw
    const checkRuleBtn = (dataAssets) => {
        if (dataAssets && dataAssets.length > 0) {

            const provided = dataAssets.find(e => ((e.assetsAddress === item.assetsAddress)));
            if (!provided) {
                setDisabledRule(true);
            }

            if (provided && provided.totalSupplied === 0) {
                setDisabledRule(true);
            }

        }
    }

    const handlerOpenModal = async () => {
        if (item && item.assetsAddress && disabledRule === false) {
            console.log("loadModalWithdraw")
            dispatch(actions.loadModalWithdraw(item));
        }
    }

    return (<>
        {
            disabledRule ? <button className="btn-veb h-10 bg-btn-veb-disabled" disabled={disabledRule} type="submit">Withdraw </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="btn-veb h-10" type="submit">Withdraw </button>
        }
    </>)
}

export default BtnOpenWithdraw;