import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Beforeunload } from "react-beforeunload";

import * as actions from "../../../actions";
import { selectApproveState } from "../../../reducers/liquid.reducer";
import { selectAssetByAddress } from "../../../reducers/assetsMarket.reducer";

const BtnLiquidityApproveB = ({ tokenAddress }) => {
  const isApproving = useSelector(selectApproveState);
  const tokenInfo = useSelector((state) =>
    selectAssetByAddress(state, tokenAddress)
  );
  const dispatch = useDispatch();

  const approveHandler = async () => {
    if (!isApproving) {
      dispatch(actions.approveSecondTokenAddLiquidity(tokenAddress));
    }
  };

  return (
    <>
      {isApproving ? (
        <Beforeunload onBeforeunload={(event) => event.preventDefault()} />
      ) : (
        ""
      )}
      <button
        onClick={(e) => {
          approveHandler(e);
        }}
        className={`btn-modal-veb w-full ${
            isApproving ? "bg-btn-veb-disabled hidden" : "bg-btn-veb"
        }`}
        type="submit"

      >
        {isApproving ? "Approving..." : `Approve ${tokenInfo?.assetsChain}`}{" "}
      </button>
    </>
  );
};

export default BtnLiquidityApproveB;
