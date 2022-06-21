import React, { useState } from "react";
import { useDispatch } from "react-redux";
import SecondaryButton from "../partials/SecondaryButton";
import * as actions from '../../actions'
import { useNavigate } from "react-router-dom";

const BtnOpenAddLiquidity = ({ item }) => {
  const btnLabel = "Add Liquidity";

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [hasAdded, setHasAdded] = useState(false);

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
  };

  const handlerOpenModal = async () => {
    // dispatch(actions.loadModalAddLiquidity(item))
    navigate("/liquidity-add");
  };

  return (
    <>
      {hasAdded ? (
        <button
          className="btn-veb h-10 bg-btn-veb-disabled border-[1px] border-[#4B5C86]"
          disabled={hasAdded}
          type="submit"
        >
          {btnLabel}
        </button>
      ) : (
        // <SecondaryButton
        //   label={btnLabel}
        //   onClick={handlerOpenModal}
        //   className="px-5 py-2"
        // />
        <button
          onClick={(e) => handlerOpenModal(e)}
          className="btn-veb text-base h-12"
          type="submit"
        >
          {btnLabel}
        </button>
      )}
    </>
  );
};

export default BtnOpenAddLiquidity;
