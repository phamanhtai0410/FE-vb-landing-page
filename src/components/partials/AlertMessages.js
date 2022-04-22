

import React, { useEffect } from 'react';
import { useSelector } from "react-redux";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AlertMessages = () => {

    const alert = useSelector(state => state.alert);

    const option = {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,

    }

    useEffect(() => {

        if (alert) {
            switch (alert.type) {

                case 'error':
                    toast.error(alert.message, option);
                    break;

                case 'warning':
                    toast.warning(alert.message, option);
                    break;

                case 'success':
                    toast.success(alert.message, option);
                    break;
                default:
                    break;

            }


        }


        // Remove given toast

    }, [alert]);

    return (<ToastContainer />);

};

export default AlertMessages;