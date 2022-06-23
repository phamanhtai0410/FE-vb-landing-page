import { useState, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from 'react-beforeunload';

import * as actions from '../../actions';

import { marketplaceConstants } from '../../constants';
import { useNavigate } from 'react-router-dom';

const BtnOpenAddLiquidity = ({ item }) => {


    const btnLabel = "Add Liquidity";

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [disabledRule, setDisabledRule] = useState(false);

    // const { data, accountSupplyBalance } = useSelector(state => state.accountAssetsReducer, shallowEqual);

    // useEffect(() => {
    //     if (data) {
    //         checkRuleBtn(data);
    //     }
    // }, [data]);

    // Rule không dc borrow token đã supply
    const checkRuleBtn = (dataAssets) => {

        // if (accountSupplyBalance === 0) {
        //     setDisabledRule(true)
        // }

        // if (dataAssets.length > 0) {
        //     const provided = dataAssets.find(e => e.assetsAddress === item.assetsAddress);
        //     if (provided && provided.totalSupplied > 0) {
        //         setDisabledRule(true)
        //     }
        // }

        // Truong hop token nay chua co ai supply
        // if (item && item.totalSupplied === 0) {
        //     setDisabledRule(true)
        // }
    }

    const handlerOpenModal = async () => {
        // if (item && item.assetsAddress && disabledRule === false) {
            // dispatch(actions.loadModalAddLiquidity(item));
            navigate("/liquidity/add");
        // }
    }

    return (<>
        {
            disabledRule ? <button className="btn-veb h-12 bg-btn-veb-disabled border-[1px] border-[#4B5C86]" disabled={disabledRule} type="submit">{btnLabel} </button>
                : <button onClick={e => { handlerOpenModal(e) }} className="btn-veb text-base h-12" type="submit">{btnLabel} </button>
        }

    </>)
}

export default BtnOpenAddLiquidity;