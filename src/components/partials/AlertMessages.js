import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import IcClose from "../../assets/images/toast/close.svg";
import AlertCustom from "./AlertCustom";

const AlertMessages = () => {
  const alert = useSelector((state) => state.alert);

  const contextClass = {
    success: "bg-popupVb",
    error: "bg-popupVb",
    info: "bg-popupVb",
    warning: "bg-popupVb",
    loading: "bg-popupVb",
    update: "bg-popupVb",
    default: "bg-popupVb",
    dark: "bg-popupVb",
  };

  useEffect(() => {
    if (alert) {
      switch (alert.type) {
        case "error":
          toast.error(genMessage(alert.message));
          break;

        case "warning":
          toast.warning(genMessage(alert.message));
          break;

        case "success":
          toast.success(genMessage(alert.message));
          break;

        case "loading":
          toast.loading(genMessage(alert.message), { icon: true, toastId: alert.message.id });
          break;

        case "update":
          toast.update(alert.message.id, {
            render: genMessage(alert.message),
            type: alert.message.status,
            isLoading: false,
            icon: false,
            autoClose: 5000
          });
          break;

        default:
          break;
      }
    }

    // Remove given toast
  }, [alert]);

  const genMessage = (message) => {
    return <AlertCustom message={message} />
  } 
  return (
    <ToastContainer
      toastClassName={({ type }) =>
        contextClass[type || "default"] +
        ` relative flex px-4 py-6 h-[100px] border-2 border-solid ${
          type === "warning" ? "border-notiWarning" : "border-notiSuccess"
        } rounded-md justify-between overflow-hidden cursor-pointer`
      }
      position={toast.POSITION.BOTTOM_RIGHT}
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      icon={false}
      closeButton={false}
    />
  );
};

export default AlertMessages;
