import { useState, useEffect } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Beforeunload } from "react-beforeunload";
import ImgRemove from '../../assets/images/buttons/img_remove_btn.svg'

import * as actions from "../../actions";

import { marketplaceConstants } from "../../constants";
import { useNavigate } from "react-router-dom";

const BtnOpenRemoveLiquidity = ({ item }) => {
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
  };

  const handlerOpenModal = async () => {
    // if (item && item.assetsAddress && disabledRule === false) {
        navigate(`/liquidity/remove/${item?.assetsPoolAddress}`);
    // }
  };

  return (
    <>
      {disabledRule || (
        <img src={ImgRemove} alt="" className="w-12 h-12 cursor-pointer" onClick={handlerOpenModal} />
      )}
    </>
  );
};

export default BtnOpenRemoveLiquidity;
