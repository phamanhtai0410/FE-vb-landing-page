import React from "react";
import { useSelector } from "react-redux";
import { CSSTransition } from "react-transition-group";
import { selectBalanceById } from "../../../../reducers/accountBalance.reducer";
import { selectAssetByAddress } from "../../../../reducers/assetsMarket.reducer";

const AssetExcerpt = ({ id, onTokenSelected }) => {
  const balance = useSelector((state) => selectBalanceById(state, id));
  const assetInfo = useSelector((state) => selectAssetByAddress(state, id));
  return (
    <CSSTransition
      key={assetInfo?.assetsAddress}
      timeout={500}
      classNames="item_asset"
    >
      <div
        className="flex flex-row justify-between items-center mt-8 cursor-pointer"
        onClick={(_) => onTokenSelected(id)}
      >
        <div className="flex flex-row items-center space-x-4">
          <img src={assetInfo?.icon} alt="" className="w-8 h-8" />
          <div className="flex flex-col">
            <p className="font-poppins_semi_bold text-base">
              {assetInfo?.assetsChain}
            </p>
            <p className="text-sm font-poppins_light">
              {assetInfo?.assetNetwork}
            </p>
          </div>
        </div>
        <p className="text-base font-poppins_semi_bold">{balance}</p>
      </div>
    </CSSTransition>
  );
};

export default React.memo(AssetExcerpt);
