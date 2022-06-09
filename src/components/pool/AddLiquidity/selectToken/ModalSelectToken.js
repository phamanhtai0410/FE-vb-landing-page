import { useEffect, useState } from "react";
import Modal from "react-modal";
import "../styles.scss";

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { numberWithCommas } from "../../../../utils/lib";
import IcQuestionOutline from "../../../../assets/images/buttons/ic_question_outline.svg";

import * as actions from "../../../../actions";
import { selectOpenChooseTokenState } from "../../../../reducers/liquid.reducer";
import SearchBar from "../../../partials/SearchBar";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { selectUserAssets } from "../../../../reducers/accountAssets.reducer";

const customStyles = {
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -30%)",
    background: "#182233",
    borderRadius: "0.5rem",
    borderWidth: "1px",
    borderColor: "#3EE8FF",
    width: "640px",
  },
};

const ModalSelectToken = () => {
  const [amount, setAmount] = useState(0);
  const [values, setValues] = useState([0]);
  const [step, setStep] = useState(1);
  const [rate, setRate] = useState(2);

  const isSelectTokenModalOpen = useSelector(selectOpenChooseTokenState);

  const assetList = useSelector(selectUserAssets, shallowEqual);
  // const assetPriceList = useSelector(selectAssetPrice, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    setStep(1);
  }, [isSelectTokenModalOpen]);

  useEffect(() => fetchUserAssets(), []);

  const fetchUserAssets = async () => {
    await dispatch(actions.getCurrentAssets());
  };

  const closeModal = () => {
    dispatch(actions.closeSelectToken());
    // if (transaction) {
    //   dispatch(actions.reloadAccountAssets());
    // }
  };

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
      <div className="header-modal">
        <h2>Select a token</h2>
        <button className="btn-modal-close" onClick={closeModal}></button>
      </div>

      <div className="content-modal mt-7 mx-6">
        {/* STEP 1 */}
        <SearchBar />
        <div className="flex flex-row space-x-1 mt-8">
          <p className="font-poppins text-xl">Select a currency</p>
          <img src={IcQuestionOutline} alt="" />
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
                    className="flex flex-row justify-between items-center mt-8 cursor-pointer"
                    onClick={(_) => onTokenSelected(item)}
                  >
                    <div className="flex flex-row items-center space-x-4">
                      <img src={item.icon} alt="" />
                      <div className="flex flex-col">
                        <p className="font-bold text-base">
                          {item.assetsChain}
                        </p>
                        <p className="text-sm">{item.assetNetwork}</p>
                      </div>
                    </div>
                    <p className="text-base font-bold">
                      {/*item.balance*/}
                      7,000
                    </p>
                  </div>
                </CSSTransition>
              );
            })}
        </TransitionGroup>
      </div>

      <div className="footer-modal pt-12">
        <button
          onClick={(e) => {
            handlerStepToStep(e);
          }}
          className={"w-full h-12 text-[#22D4EC] text-lg"}
        >
          Manage Tokens
        </button>
      </div>
    </Modal>
  );
};

export default ModalSelectToken;
