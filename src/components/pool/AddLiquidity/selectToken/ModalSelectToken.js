import { useCallback, useEffect, useState } from "react";
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
import GradientStrokeWrapper from "../../../partials/GradientStrokeWrapper";
import { PartialConstants } from "../../../../constants/partial.constants";
import { selectUserAssetsBalance } from "../../../../reducers/accountBalance.reducer";
import AssetExcerpt from "./AssetExcerpt";

const customStyles = {
  content: {
    top: "24%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderWidth: "0px",
    borderRadius: "1rem",
    // borderColor: "#3EE8FF",
    padding: "2.5rem",
    width: "32%",
    position: "relative",
  },
};

const ModalSelectToken = () => {
  const isSelectTokenModalOpen = useSelector(selectOpenChooseTokenState);

  const assetList = useSelector(selectUserAssetsBalance, shallowEqual);
  // const assetPriceList = useSelector(selectAssetPrice, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => fetchUserAssets(), []);

  const fetchUserAssets = async () => {
    await dispatch(actions.getCurrentAssets());
    // await dispatch(actions.fetchAccountInit());
  };

  const closeModal = () => dispatch(actions.closeSelectToken());
  const handlerStepToStep = (e) => {};

  const onTokenSelected = useCallback(
    (tokenData) => {
      dispatch(actions.selectToken(tokenData));
    },
    [dispatch]
  );

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
        borderRadius="1rem"
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

      <div className="content-modal mt-12">
        {/* STEP 1 */}
        <SearchBar />
        <div className="flex flex-row space-x-2 items-center mt-8">
          <p className="font-poppins_light text-xl">Select a currency</p>
          <img src={IcQuestionOutline} alt="" className="w-4 h-4" />
        </div>

        <TransitionGroup>
          {assetList &&
            assetList.length > 0 &&
            assetList.map((item) => (
              <AssetExcerpt
                key={item.assetsAddress}
                id={item.assetsAddress}
                onTokenSelected={onTokenSelected}
              />
            ))}
        </TransitionGroup>
      </div>

      <div className="footer-modal mt-8">
        <button
          onClick={(e) => {
            handlerStepToStep(e);
          }}
          className={"w-full h-12 text-[#22D4EC] text-lg font-poppins_medium"}
        >
          Manage Tokens
        </button>
      </div>
    </Modal>
  );
};

export default ModalSelectToken;
