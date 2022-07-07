import React, { useEffect, useState } from "react";
import IcClose from "../../assets/images/toast/close.svg";
import IcSuccess from "../../assets/images/toast/success.svg";
import IcWarning from "../../assets/images/toast/warning.svg";
import { useSelector } from "react-redux";

const AlertCustom = ({ type, message, description }) => {
  const alert = useSelector((state) => state.alert);
  const [icon, setIcon] = useState("");
  useEffect(() => {
    if (alert.type === "update") {
      if (alert.status === "success") {
        setIcon(IcSuccess);
      }
      if (alert.status === "warning") {
        setIcon(IcWarning);
      }
    }
  }, [alert]);

  return (
    <div className="flex flex-row items-start justify-between">
      <div className="flex flex-row items-start">
        {icon ? <img src={icon} alt="" /> : null}
        <div className="flex flex-col -mt-[4px] pl-6">
          <span className="font-poppins font-[600] text-base text-white">
            {message}
          </span>
          <span className="font-poppins text-sm text-[#7694DE]">
            {description}
          </span>
        </div>
      </div>
      <img src={IcClose} alt="" />
    </div>
  );
};

export default AlertCustom;
