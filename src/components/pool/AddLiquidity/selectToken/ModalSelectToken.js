import { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles.scss";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { numberWithCommas } from "../../../../utils/lib";
import IcQuestionOutline from "../../../../assets/images/buttons/ic_question_outline.svg";
import IcCloseWhite from "../../../../assets/images/buttons/ic_close.svg";

import * as actions from "../../../../actions";
import { selectOpenChooseTokenState } from "../../../../reducers/liquid.reducer";
import SearchBar from "../../../partials/SearchBar";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { selectUserAssets } from "../../../../reducers/accountAssets.reducer";
import GradientStrokeWrapper from "../../../partials/GradientStrokeWrapper";
import { PartialConstants } from "../../../../constants/partial.constants";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderWidth: "0px",
    // borderColor: "#3EE8FF",
    padding: "2rem",
    width: "32%",
    position: "relative",
  },
};

const ModalSelectToken = () => {
  const isSelectTokenModalOpen = useSelector(selectOpenChooseTokenState);

  const assetList = useSelector(selectUserAssets, shallowEqual);
  // const assetPriceList = useSelector(selectAssetPrice, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => fetchUserAssets(), []);

  const fetchUserAssets = async () => {
    await dispatch(actions.getCurrentAssets());
  };

  const closeModal = () => dispatch(actions.closeSelectToken());
  const handlerStepToStep = (e) => {};

  const onTokenSelected = (tokenData) => {
    dispatch(actions.selectToken(tokenData));
  };

  return (
    <Modal
      isOpen={isSelectTokenModalOpen}
      ariaHideApp={false}
      style={customStyles}
      portalClassName="modal-veb"
      overlayClassName="overlay"
    >
      <GradientStrokeWrapper
        colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST}
        className="-z-50"
        borderRadius="0.5rem"
      />
      <div className="header">
        <h2>Select a token</h2>
        <img
          alt=""
          src={IcCloseWhite}
          className="cursor-pointer"
          onClick={closeModal}
        />
      </div>

      <div className="content-modal mt-7">
        {/* STEP 1 */}
        <SearchBar />
        <div className="flex flex-row space-x-1.5 mt-6 items-center">
          <p className="font-poppins_light text-base">Select a currency</p>
          <img src={IcQuestionOutline} alt="" className="w-3 h-3" />
        </div>

        <TransitionGroup>
          {assetList &&
            assetList.length > 0 &&
            assetList.map((item) => {
              return (
                <CSSTransition
                  key={item.assetsAddress}
                  timeout={500}
                  classNames="item_asset"
                >
                  <div
                    className="flex flex-row justify-between items-center mt-6 cursor-pointer"
                    onClick={(_) => onTokenSelected(item)}
                  >
                    <div className="flex flex-row items-center space-x-3">
                      <img src={item.icon} alt="" className="w-6 h-6" />
                      <div className="flex flex-col">
                        <p className="font-poppins_semi_bold text-xs">
                          {item.assetsChain}
                        </p>
                        <p className="text-xs font-poppins_light">{item.assetNetwork}</p>
                      </div>
                    </div>
                    <p className="text-sm font-poppins_semi_bold">
                      {/*item.balance*/}
                      7,000
                    </p>
                  </div>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </div>

      <div className="footer-modal mt-6">
        <button
          onClick={(e) => {
            handlerStepToStep(e);
          }}
          className={"w-full h-12 text-[#22D4EC] text-sm"}
        >
          Manage Tokens
        </button>
      </div>
    </Modal>
  );
};

export default ModalSelectToken;
