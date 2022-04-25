
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Range } from "react-range";
import { ThreeDots } from 'react-loading-icons';

import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { numberWithCommas } from '../../utils/lib';

import { marketplaceConstants } from '../../constants';
import BtnSupply from './BtnSupply';

import IcNext from '../../assets/images/ic_next.svg';
import IcNext1 from '../../assets/images/ic_factory.svg';

import IcExplorer from '../../assets/images/ic_explorer.svg';
import IcSuccess from '../../assets/images/ic_success.svg';


const customStyles = {
    content: {
        top: '30%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -30%)',
        background: "#1D1A3F",
        border: "none",
        borderRadius: "8px",
        padding: 0,
        width: '640px'
    },
};

const IcVeb = "https://s3-alpha-sig.figma.com/img/63b8/0ba4/e17d8cf47adbdc845047e5c2eba0e8e5?Expires=1651449600&Signature=HZ7riBcgpeAWRTg6o1deCxabVzsv81yaab2vUaSJFu92d5SC65trDhN13ZZcTLLSPdqWc-PTUqm-zqn3HR-VRKtAabwvCy~TdwE43i7Gey0TahfHcpN~jg06E6ijdhjpYWMshhypo4vQBKG7Dwsc~~Aj4zjba7daY8YXiU7AH0mqawmWUxHCkQx5fxSEZv3yjc1uPx04UuKDJkX-tavOTATp8OvW0DY7gyNDo8bSGGtyvIL--QYIM7eNcugYVjUz5NInom2mwJUF-i6RL2X-IhXAbn-uLfpOKfR2qxGxV1qA5Kp8TCcGfSj7IHvV-wF6LpZjOIPcOBSDTBmQ~OnheA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"

const ModalSupply = () => {

    const [amount, setAmount] = useState(0);
    const [values, setValues] = useState([0]);
    const [step, setStep] = useState(1);
    const [rate, setRate] = useState(null);

    const balanceAccount = 5000;

    const { data, errorCode, message, transaction, pending, isOpen } = useSelector(state => state.supplyReducer, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        resetFrm();
    }, [data.id]);

    const resetFrm = () => {
        setAmount(0);
        setValues([0]);
        setStep(1);
    }

    const closeModal = () => {
        dispatch({
            type: marketplaceConstants.MODAL_CLOSE_SUPPLY_MARKET
        })
    };

    const closeModalAndDashboard = () => {
        closeModal();
        resetFrm();
    }

    const onChangeRangeAmount = (values) => {
        setValues(values);
        setAmount(values[0]);
    }

    const onChangeAmount = (e) => {
        const { value } = e.target;
        if (value <= balanceAccount) {
            setAmount(value)
            setValues([value]);
        }
    }

    const handlerStepToStep = (e) => {
        if (step === 1 && amount > 0) {
            setStep(2);
        }
    }

    const showCheckStepContinue = () => {
        if (step === 1 && amount > 0) {
            return true;
        }
    }

    return (

        <Modal
            // isOpen={Object.keys(data).length > 0 ? true : false}
            isOpen={isOpen}
            ariaHideApp={false}
            style={customStyles}
            portalClassName="modal-veb"
            overlayClassName="overlay-lur">

            <div className="header-modal" >
                <h2>Supply BUSD</h2>
                <button className="btn-modal-close" onClick={closeModal}></button>
            </div>

            <div className="content-modal">

                {/* STEP 1 */}
                <div className={step === 1 ? "" : "hidden"}>
                    <div className='mt-4'>
                        <p className='w-full font-montserrat text-center text-lg text-[#A0D911] leading-6'>How much would you like to suply?</p>
                        <p className='w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6'>
                            Please enter an amount you would like to supply. The maximum amount you can supply is shown below.
                        </p>
                    </div>

                    <div class="flex justify-between px-8 mt-12 text-lg font-sf_pro">
                        <div className='text-[#FAFAFA]'>
                            Available to supply
                        </div>
                        <div>
                            <span className='font-poppins font-bold'>5,000</span><span className='text-[#BFBFBF] pl-2'>VET</span>
                        </div>
                    </div>

                    <div className="bg-gradient-search rounded-lg flex flex-row mt-2 mx-8 py-4 px-4 justify-between">
                        <img className='w-12 h-8 pr-3' src={IcVeb} alt="Token VEBank" />
                        <input
                            value={amount}
                            onChange={onChangeAmount}
                            className="bg-transparent focus:outline-none placeholder-slate-400 font-poppins appearance-none text-base w-full"
                            type="text"
                            placeholder={"Amount"}
                        />
                        <span onClick={e => {
                            onChangeRangeAmount([balanceAccount])
                        }} className='font-poppins font-bold text-[#A0D911] text-lg cursor-pointer'>Max</span>

                    </div>

                    {/* <div className='flex justify-between px-8 mt-12 font-poppins text-sm leading-4 text-slate-200'>
                        <label>Safer</label>
                        {showFactor()}
                        <label>Riskier</label>
                    </div> */}
                    {/* 
                    <div className='px-8'>
                        <Range
                            step={1}
                            min={0}
                            max={balanceAccount}
                            values={values}
                            onChange={(values) => {
                                onChangeRangeAmount(values)
                            }}
                            renderTrack={({ props, children }) => (
                                <div
                                    {...props}
                                    className="w-full h-3 pr-2 my-4 bg-gradient-range-amount rounded-md"
                                >
                                    {children}
                                </div>
                            )}
                            renderThumb={({ props }) => (
                                <div
                                    {...props}
                                    className="w-3 h-3 transform translate-x-10 bg-slate-50 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                />
                            )}
                        />
                    </div> */}
                </div>

                {/* STEP 2 */}
                <div className={step === 2 ? "" : "hidden"}>

                    <div className='mt-4'>
                        <p className='w-full font-montserrat text-center text-lg text-[#A0D911] leading-6'>Supply overview</p>
                        <p className='w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6'>
                            There are your transaction details. Make sure to check
                            if this is correct before submitting.
                        </p>
                    </div>

                    <div className='border-2 border-solid border-[#363564] mx-8 p-6 mt-10'>

                        <div class="flex justify-between text-lg font-poppins">
                            <div className='text-[#FAFAFA] font-light'>
                                Amount
                            </div>
                            <div className='flex items-center'>
                                <img className='w-6 h-6' src={IcVeb} alt="Token VEBank" />
                                <span className='font-poppins font-bold pl-2'>{numberWithCommas(amount)}</span>
                                <span className='text-[#BFBFBF] pl-2'>VET</span>
                            </div>
                        </div>

                        <div class="flex justify-between text-lg font-poppins">
                            <div className='text-[#FAFAFA]'>
                            </div>
                            <div>
                                <span className='font-poppins font-thin text-sm'>{numberWithCommas(amount)}</span>
                            </div>
                        </div>


                        <div class="flex justify-between text-lg font-poppins pt-4">
                            <div className='text-[#FAFAFA] font-light'>
                                Collateral Usage
                            </div>
                            <div>
                                <span className='font-poppins font-bold text-[#52E9A9]'>YES</span>
                            </div>
                        </div>

                    </div>

                    <div className='border-2 border-solid border-[#363564] mx-8 my-12'>

                        <div class="flex justify-between text-lg font-poppins">
                            <div className={`text-[#FAFAFA] bg-[#39355F] text-base text-center font-light  w-1/2 p-1 bg-btn-veb ${pending === true ? "bg-pending" : ""} ${transaction ? "bg-success" : ""}`}>
                                1 Supply
                            </div>
                            <div className={`text-[#FAFAFA] bg-[#39355F] text-base text-center font-light w-1/2 p-1 ${pending === true ? "bg-pending ml-1" : ""} ${transaction ? "bg-success" : ""}`}>
                                2  {pending ? "Pending" : "Finished"}
                            </div>
                        </div>

                        <div class="flex justify-between text-lg font-poppins p-6">
                            <div className='font-light text-base flex items-center'>

                                {transaction ?
                                    <label className='text-[#50e3ab]'>2/2 Success!</label>
                                    : ""
                                }

                                {(pending === false && transaction === null) ?
                                    <>
                                        <label className='text-[#50e3ab]'>1/2 Supply</label>
                                        <div className='text-[#FAFAFA] pt-2'>Please submit to supply</div>
                                    </>
                                    : ""}

                                {(pending === true && transaction === null) ? <p className='text-[#FA8C16] text-left'>Transaction(s) Pending</p> : ""}

                            </div>

                            <div className='pt-1 flex flex-row'>


                                {transaction ?
                                    <button onClick={e => { closeModalAndDashboard(e) }} className={`btn-modal-veb bg-btn-veb`} type="submit">Dashboard</button>
                                    :
                                    ""
                                }

                                {(pending === false && transaction === null) ? <BtnSupply pending={pending} amount={amount} /> : ""}

                            </div>

                        </div>

                        {transaction || pending === true ?
                            <div className='flex flex-row border-t-2 border-solid border-[#363564] font-poppins text-base'>
                                <div className='flex-1 w-32 border-r-2 border-solid border-[#363564] indent-3.5 p-2'>Supply</div>
                                <div className='flex-1 w-32 border-r-2 border-solid border-[#363564] flex items-center indent-3.5 p-2'>
                                    Pending
                                    {transaction ? <img className='ml-2' src={IcSuccess} alt="icon success" /> : <ThreeDots className='w-6 h-6 ml-2' />}
                                </div>
                                <div className='flex-1 w-32 flex items-center indent-3.5 p-2 cursor-pointer'>
                                    Explorer
                                    <img className='ml-2' src={IcExplorer} />
                                </div>
                            </div>
                            : ""}



                    </div>

                </div>

            </div>

            {
                (step === 1) ?
                    <div className="footer-modal px-8 py-12">
                        <button
                            onClick={e => { handlerStepToStep(e) }}
                            className={`btn-modal-veb w-full ${showCheckStepContinue() ? "bg-btn-veb" : ""} `} >Continue</button>
                    </div> : ""
            }

        </Modal>
    )
}

export default ModalSupply;