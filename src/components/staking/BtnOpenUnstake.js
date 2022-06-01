import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loadModalUnStake } from "../../actions/unstake.action";

const btnLabel = "Unstake";
const BtnOpenUnstake = ({ item }) => {
  const dispatch = useDispatch();

  const [disabledRule, setDisabledRule] = useState(true);

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
    dispatch(loadModalUnStake(item));
  };

  return (
    <>
      {disabledRule ? (
        <button
          onClick={(e) => handlerOpenModal()}
          className="btn-veb flex-1 bg-btn-veb-disabled border-[1px] border-[#4B5C86]"
          // disabled={disabledRule}
          type="submit"
        >
          {btnLabel}
        </button>
      ) : (
        <button
          onClick={(e) => handlerOpenModal()}
          className="btn-veb flex-1"
          type="submit"
        >
          {btnLabel}
        </button>
      )}
    </>
  );
};

export default BtnOpenUnstake;
