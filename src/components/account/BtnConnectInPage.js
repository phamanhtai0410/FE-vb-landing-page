import { useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../actions";
import AlertCustom from "../partials/AlertCustom";

const BtnConnectInPage = ({ ...props }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const dispatch = useDispatch();

  const connectWalletHandler = async () => {
    if (!isConnecting) {
      setIsConnecting(true);
      alertLoginHandler(true, "loading");
      await dispatch(actions.web3Connect(true))
        .then(() => {
          setIsConnecting(false);
          alertLoginHandler(false, "success");
        })
        .catch((e) => {
          setIsConnecting(false);
          alertLoginHandler(false, "warning");
        });
    }
  };

  const alertLoginHandler = (isConnecting, status) => {
    if (isConnecting) {
      dispatch(
        actions.alertActions.loading(
          <AlertCustom
            type="loading"
            message="Waiting for connect wallet"
            description="Wallets: 0x5566...0d6a"
          />,
          "login",
          status
        )
      );
    } else {
      dispatch(
        actions.alertActions.update(
          <AlertCustom
            // type={status}
            message={status==="success" ? "Syn2 Wallet Connected" : "Syn2 Wallet Rejected"}
            description="Wallets: 0x5566...0d6a"
          />,
          "login",
          status
        )
      );
    }
    return;
  };

  return (
    <>
      <button {...props} onClick={connectWalletHandler} type="submit">
        {isConnecting ? "Connecting..." : "Connect to a wallet"}
      </button>
    </>
  );
};

export default BtnConnectInPage;
