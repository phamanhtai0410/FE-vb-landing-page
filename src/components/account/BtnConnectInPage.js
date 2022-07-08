import { useState } from "react";
import { useDispatch } from "react-redux";

import * as actions from "../../actions";
import AlertCustom from "../partials/AlertCustom";
import { v4 as uuidv4 } from "uuid";
import { alertVariable } from "../../constants";

const BtnConnectInPage = ({ ...props }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const dispatch = useDispatch();

  const connectWalletHandler = async () => {
    const alertData = {
      id: uuidv4(),
      status: "loading",
      title: alertVariable.LOGIN_LOADING,
      description: "Wallets: 0x5566...0d6a",
      ext: "",
    };
    if (!isConnecting) {
      setIsConnecting(true);
      alertLoginHandler(true, alertData);
      await dispatch(actions.web3Connect(true))
        .then(() => {
          setIsConnecting(false);
          alertData.title = alertVariable.LOGIN_SUCCESS;
          alertData.status = "success";
          alertLoginHandler(false, alertData);
        })
        .catch((e) => {
          setIsConnecting(false);
          alertData.title = alertVariable.LOGIN_ERROR;
          alertData.status = "warning";
          alertLoginHandler(false, alertData);
        });
    }
  };

  const alertLoginHandler = (pending, data) => {
    if (pending) {
        dispatch(actions.alertActions.loading(data, data.id));
    }
    else {
        dispatch(actions.alertActions.update(data, data.id));
    }
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
