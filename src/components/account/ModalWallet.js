import React from "react";
import { PartialConstants } from "../../constants/partial.constants";
import GradientStrokeWrapper from "../partials/GradientStrokeWrapper";

import IcLogout from "../../assets/images/ic_logout.svg";
import IcExplorer from "../../assets/images/view_explore.svg";
import IcCopy from "../../assets/images/copy.svg";

const ModalWallet = ({ isOpen, onCopy, disConnectWallet, onClose }) => {
  return (
    <div className={`${isOpen ? "flex" : "hidden"} absolute right-0 top-16 fade-in-right`}>
      <div className="relative">
        <GradientStrokeWrapper
          colors={PartialConstants.PRIMARY_GRADIENT_COLOR_LIST}
          borderRadius="1rem"
          className="z-[1]"
        />
        <div className="bg-color-modal-wallet rounded-2xl flex flex-col p-6">
          <button
            className="bg-color-item-modal-wallet py-2 px-4 rounded-lg w-72 flex flex-row items-center z-[2] hover:bg-color-item-hover-modal-wallet"
            onClick={onCopy}
          >
            <img
              className="p-[10px] w-10 h-10"
              src={IcCopy}
              alt="icon logout"
            />
            <p>Copy address</p>
          </button>
          <button
            className="bg-color-item-modal-wallet py-2 px-4 rounded-lg w-72 my-4 flex flex-row items-center z-[2] hover:bg-color-item-hover-modal-wallet"
            onClick={() => {}}
          >
            <img
              className="p-[10px] w-10 h-10"
              src={IcExplorer}
              alt="icon logout"
            />
            <p>View on Explorer</p>
          </button>
          <button
            className="bg-color-item-modal-wallet py-2 px-4 rounded-lg w-72 flex flex-row items-center z-[2] hover:bg-color-item-hover-modal-wallet"
            onClick={disConnectWallet}
          >
            <img
              className="p-[10px] w-10 h-10"
              src={IcLogout}
              alt="icon logout"
            />
            <p>Disconnect Wallet</p>
          </button>
        </div>
      </div>
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-transparent z-[1]"
        onClick={onClose}
      />
    </div>
  );
};

export default ModalWallet;
