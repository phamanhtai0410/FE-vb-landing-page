import React, { Fragment, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectPoolInfoByAddress } from "../../../reducers/assetsPool.reducer";
import { selectUserAmountAByPoolAddress, selectUserAmountBByPoolAddress, selectUserLiquidityPoolByPoolAddress, selectUserPoolAssetByPoolAddress } from "../../../reducers/userAssetPools.reducer";
import { nFormatter, numberWithCommas } from "../../../utils/lib";
import LiquidPairIcon from "../../partials/LiquidPairIcon";
import IcCollapse from "../../../assets/images/buttons/ic_collapse.svg";
import { useNavigate } from "react-router-dom";
import RouteName from "../../../constants/routeName.constants";

const LiquidityExcerpt = ({ poolAddress, poolSelect, setPoolSelect }) => {
  const navigate = useNavigate();

  const poolInfo = useSelector((state) =>
    selectPoolInfoByAddress(state, poolAddress)
  );
  const userLiquidity = useSelector((state) =>
    selectUserLiquidityPoolByPoolAddress(state, poolAddress)
  );
  const amountTokenA = useSelector((state) => selectUserAmountAByPoolAddress(state, poolAddress));
  const amountTokenB = useSelector((state) => selectUserAmountBByPoolAddress(state, poolAddress));

  const shareAPool = useMemo(
    () => (userLiquidity / poolInfo?.liquidity) * 100.0,
    [poolInfo?.liquidity, userLiquidity]
  );

  const removeLiquidity = () => {
    navigate(`${RouteName.REMOVE_LIQUIDITY}/${poolAddress}`);
  };

  const handleAddLiquidity = () => {
    navigate(`${RouteName.ADD_LIQUIDITY}/${poolAddress}`);
  };

  const onClickPool = (poolAddress) => {
    if (poolAddress===poolSelect) {
      setPoolSelect("");
    }
    else {
      setPoolSelect(poolAddress);
    }
  };

  return (
    <div className="liquid-wrapper px-4 py-4 col-y-center">
      <div
        className="flex flex-row justify-between items-start cursor-pointer"
        onClick={() => onClickPool(poolAddress)}
      >
        <div className="flex flex-col space-y-2">
          <div className="flex flex-row items-center space-x-4">
            <LiquidPairIcon
              iconAsset1={poolInfo?.iconOrigin}
              iconAsset2={poolInfo?.iconAssets}
              iconSize="6"
            />
            <p className="font-poppins_semi_bold text-xl">{`${poolInfo?.assetsChainA}/${poolInfo?.assetsChainB}`}</p>
          </div>
          <p className="w-2/3 text-xl text-grey-2 font-poppins_light">
            {nFormatter(userLiquidity, 5)}
          </p>
        </div>
        <img
          src={IcCollapse}
          alt=""
          className={`w-11 h-11 transition-transform delay-350 ${
            poolAddress!==poolSelect ? "rotate-180" : ""
          }`}
        />
      </div>
      {
        <div className={`${(poolAddress === poolSelect) ? "flex" : "hidden"} fade-in-box flex-col`}>
          <div className="col mt-10 space-y-6">
            <div className="full-row-between-center space-x-4">
              <img src={poolInfo?.iconOrigin} alt="" className="w-8 h-8" />
              <p className="flex-grow font-poppins_semi_bold text-xl">{`Pooled ${poolInfo?.assetsChainA}`}</p>
              <p className="text-xl font-poppins_light">
                {nFormatter(amountTokenA, 5)}
              </p>
            </div>
            <div className="full-row-between-center space-x-4">
              <img src={poolInfo?.iconAssets} alt="" className="w-8 h-8" />
              <p className="flex-grow font-poppins_semi_bold text-xl">{`Pooled ${poolInfo?.assetsChainB}`}</p>
              <p className="text-xl font-poppins_light">
                {nFormatter(amountTokenB, 5)}
              </p>
            </div>
            <div className="full-row-between-center">
              <p className="text-vbLine text-xl font-poppins_light">
                Share a Pool
              </p>
              <p className="text-vbLine text-xl font-poppins_light">{`${
                shareAPool < 0.01 ? "<0.01" : nFormatter(shareAPool, 5)
              }%`}</p>
            </div>
          </div>
          <button
            onClick={removeLiquidity}
            className="btn-modal-veb w-full h-16.5 mt-10 text-lg font-poppins_medium bg-btn-veb"
          >
            Remove
          </button>
          <p
            onClick={handleAddLiquidity}
            className="flex flex-1 self-center text-[#22D4EC] mt-6 text-lg font-poppins_medium text-center cursor-pointer"
          >
            + Add liquidity instead
          </p>
        </div>
      }
    </div>
  );
};

export default React.memo(LiquidityExcerpt);
