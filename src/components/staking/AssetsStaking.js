import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import IcDropdown from "../../assets/images/ic_down_asset.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";
import StakingRowAction from "./StakingRowAction";
import GradientStrokeWrapper from '../partials/GradientStrokeWrapper'

const DATA_SAMPLE = [
  {
    iconStake: IcVeBank,
    assetStakeName: "VB",
    assetPoolAddress: process.env.REACT_APP_TOKEN_VEBANK,
    assetDecimals: 18,
    pendingReward: "0",
    staked: "0",
    apr: "15.5",
    totalStaked: {
      usd: "36,000,000",
      vB: "20,000,000",
    },
  },
];

const AssetsStaking = () => {
  const [openRowAssets, setOpenRowAssets] = useState([]);

  const dispatch = useDispatch();

  const { web3 } = useSelector((state) => state.web3, shallowEqual);

  const onClickShowRowAssets = (assetsAddress) => {
    const listShowChecked = [...openRowAssets];
    const indexShow = openRowAssets.indexOf(assetsAddress);

    if (indexShow === -1) {
      listShowChecked.push(assetsAddress);
    } else {
      listShowChecked.splice(indexShow, 1);
    }

    setOpenRowAssets(listShowChecked);
  };

  const checkShowDown = (assetsAddress) => {
    return !(openRowAssets.indexOf(assetsAddress) === -1);
  };

  const showListAsset = (dataList) => {
    if (dataList && dataList.length > 0) {
      return dataList.map((item) => (
        <CSSTransition
          key={item.assetsAddress}
          timeout={500}
          classNames="item_asset"
        >
          <div className="border-0 relative rounded-lg" onClick={(e) => onClickShowRowAssets(item.assetsPoolAddress)}>
            <GradientStrokeWrapper className="-z-0" />
            <div
              className="full-row-between-center p-6 bg-[#182844] justify-items-center content-around font-poppins cursor-pointer rounded-lg z-50"
              onClick={(e) => onClickShowRowAssets(item.assetsPoolAddress)}
            >
              <div className="row-center space-x-4 text-right cursor-pointer">
                <img
                  className="h-8 w-8 rounded-full"
                  src={item.iconStake}
                  alt=""
                />
                <span className="text-lg font-poppins_medium text-left w-28">
                  {item.assetStakeName}
                </span>
              </div>
              <div className="w-2/3 row-center justify-between">
                <div className="row flex-grow mr-16 divide-x divide-vbLine">
                  {/*<span className="inline-flex mt-[1px] mx-3 h-5 w-[1px] bg-[#2A9F89]" />*/}

                  <div className="full-col items-center space-y-4 border-l border-l-vbLine">
                    <div className="text-sm text-[#678BCA]">
                      Pending Rewards
                    </div>
                    <div className="text-base font-semibold text-[#3EE8FF]">
                      {item.pendingReward} {item.assetStakeName}
                    </div>
                  </div>

                  <div className="full-col items-center space-y-4">
                    <div className="text-sm text-[#678BCA]">Staked</div>
                    <div className="text-base font-semibold text-[#3EE8FF]">
                      {item.staked} {item.assetStakeName}
                    </div>
                  </div>

                  <div className="full-col items-center space-y-4">
                    <div className="text-sm text-[#678BCA]">APR</div>
                    <div className="text-base font-semibold text-[#3EE8FF]">
                      {item.apr}%
                    </div>
                  </div>

                  <div className="full-col items-center">
                    <div className="col justify-center space-y-2">
                      <div className="text-sm text-[#678BCA]">Total Staked</div>
                      <div className="text-base font-semibold text-[#3EE8FF]">
                        ~${item.totalStaked.usd}
                      </div>
                      <div className="text-sm text-[#678BCA]">
                        {item.totalStaked.vB} {item.assetStakeName}
                      </div>
                    </div>
                  </div>
                  {/* <div className="col-span-1 flex flex-col justify-center items-center cursor-pointer">
                  <img
                    className={`w-4 h-4 transition-transform delay-350 ${
                      checkShowDown(item.assetsPoolAddress) ? "rotate-180" : ""
                    }`}
                    src={IcDropdown}
                    alt=""
                  />
                </div> */}
                </div>
                <img
                  className={`w-4 h-4 transition-transform delay-350 ${
                    checkShowDown(item.assetsPoolAddress) ? "rotate-180" : ""
                  }`}
                  src={IcDropdown}
                  alt=""
                />
              </div>
            </div>

            <StakingRowAction
              key={item.assetsPoolAddress + "_act"}
              openRowAssets={openRowAssets}
              item={item}
            />
          </div>
        </CSSTransition>
      ));
    }
  };

  useEffect(() => {
    if (web3) {
      // fetchMarketAssets();
    }
  }, [web3]);

  return (
    <div className="w-full min-h-max rounded bg-[#171C29] mt-10 p-10 fade-in-box z-100">
      <h4 className="text-xl leading-9 text-[#3FDCA5]">
        Staking
      </h4>

      <div className="tbl-veb mt-8">
        <TransitionGroup>{showListAsset(DATA_SAMPLE)}</TransitionGroup>
      </div>
    </div>
  );
};

export default AssetsStaking;
