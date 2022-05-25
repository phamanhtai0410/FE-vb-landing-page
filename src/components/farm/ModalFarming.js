import React, {useState} from 'react';
import Modal from 'react-modal';
import IcWarningCircle from "../../assets/images/ic-warning-circle.svg";
import IcVeBank from "../../assets/images/ic_vebank.svg";

const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -30%)',
        background: "#182233",
        border: "none",
        borderRadius: "8px",
        padding: 0,
        width: '640px'
    },
};

const ModalFarming = ({isOpen, closeModal}) => {

    const [amount, setAmount] = useState("0");

    return (
        <Modal
            isOpen={isOpen}
            ariaHideApp={false}
            style={customStyles}
            portalClassName="modal-veb"
            overlayClassName="overlay-lur">

            <div className="header-modal">
                <h2>Farm</h2>
                <button className="btn-modal-close" onClick={closeModal}/>
            </div>

            <div className="content-modal px-6 space-y-4 pb-4">
                <div className="flex justify-between">
                    <div className="flex space-x-2">
                        <p>Balance</p>
                        <img src={IcWarningCircle} alt="" />
                    </div>
                    <p>5,000 LP</p>
                </div>
                <div className="bg-gradient-search rounded-lg flex flex-row p-4 justify-between">
                    <img className='w-12 h-8 pr-3' src={IcVeBank} alt="Token VEBank" />
                    <input
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base w-full"
                        type="text"
                        placeholder={"Amount"}
                    />
                    <span className='font-poppins font-bold text-[#A0D911] text-lg cursor-pointer'>Max</span>
                </div>
                <div className="flex justify-between space-x-5 pt-5">
                    <button className="btn-veb h-12 w-1/2">Cancel</button>
                    <button
                        className={`btn-veb h-12 w-1/2 ${(parseFloat(amount) <= 0) ? "bg-btn-veb-disabled border-[1px] border-[#4B5C86]" : ""}`}
                        disabled={parseFloat(amount) <= 0}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ModalFarming;
