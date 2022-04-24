
import { useEffect, useState } from 'react';
import Modal from 'react-modal';
import { Range } from "react-range"

import { useSelector, useDispatch, shallowEqual } from "react-redux";

import { marketplaceConstants } from '../../constants';
import BtnBorrow from './BtnBorrow';
import IcNext from '../../assets/images/ic_next.svg';
import IcNext1 from '../../assets/images/ic_factory.svg';



const customStyles = {
    content: {
        top: '40vh',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        transform: 'translate(-50%, -50%)',
        background: "#1D1A3F",
        border: "none",
        borderRadius: "8px",
        padding: 0,
        width: '640px'
    },
};

const IcVeb = "https://s3-alpha-sig.figma.com/img/63b8/0ba4/e17d8cf47adbdc845047e5c2eba0e8e5?Expires=1651449600&Signature=HZ7riBcgpeAWRTg6o1deCxabVzsv81yaab2vUaSJFu92d5SC65trDhN13ZZcTLLSPdqWc-PTUqm-zqn3HR-VRKtAabwvCy~TdwE43i7Gey0TahfHcpN~jg06E6ijdhjpYWMshhypo4vQBKG7Dwsc~~Aj4zjba7daY8YXiU7AH0mqawmWUxHCkQx5fxSEZv3yjc1uPx04UuKDJkX-tavOTATp8OvW0DY7gyNDo8bSGGtyvIL--QYIM7eNcugYVjUz5NInom2mwJUF-i6RL2X-IhXAbn-uLfpOKfR2qxGxV1qA5Kp8TCcGfSj7IHvV-wF6LpZjOIPcOBSDTBmQ~OnheA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"

const ModalBorrow = () => {

    const [amount, setAmount] = useState(0);
    const [values, setValues] = useState([0]);
    const [step, setStep] = useState(1);
    const [rate, setRate] = useState(null);


    const { data, errorCode, message, transaction, pending, isOpen } = useSelector(state => state.borrowReducer, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        setAmount(0);
    }, [data.id]);

    const closeModal = () => {
        dispatch({
            type: marketplaceConstants.MODAL_CLOSE_BORROW_MARKET
        })
    };

    const onChangeRangeAmount = (values) => {
        setValues(values);
        setAmount(values[0])
    }

    const onChangeAmount = (e) => {
        const { value } = e.target;
        if (value <= 5000) {
            setAmount(value)
            setValues([value]);
        }

    }
    const handlerStepToStep = (e) => {

        if (step === 1 && amount > 0) {
            setStep(2);
        }

        if (step === 2 && rate > 0) {
            setStep(3);
        }


    }

    const handlerChangeRate = (value) => {
        setRate(value)
    }

    const showCheckStepContinue = () => {

        if (step === 1 && amount > 0) {
            return true;
        }

        if (step === 2 && (rate === 1 || rate === 2)) {
            return true;
        }

    }

    const showFactor = () => {
        if (step === 1 && amount > 0) {
            return (
                <div className='font-poppins font-light'>New health factor  <span className='font-bold'>1.03</span></div>
            )
        }

    }

    return (

        <Modal
            // isOpen={Object.keys(data).length > 0 ? true : false}
            isOpen={isOpen}
            ariaHideApp={false}
            style={customStyles}
            contentLabel="Example Modal"
            portalClassName="modal-lur"
            overlayClassName="overlay-lur">

            <div className="header-modal" >
                <h2>Borrow BUSD</h2>
                <button className="btn-modal-close" onClick={closeModal}></button>
            </div>

            <div className="content-modal modal-sale">

                {/* STEP 1 */}
                <div className={step === 1 ? "" : "hidden"}>
                    <div className='mt-4'>
                        <p className='w-full font-montserrat text-center text-lg text-[#A0D911] leading-6'>How much would you like to borrow?</p>
                        <p className='w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6'>
                            Please enter an amount you would like to borrow. The maximum amount you can borrow is shown below.
                        </p>
                    </div>

                    <div class="flex justify-between px-8 mt-12 text-lg font-sf_pro">
                        <div className='text-[#FAFAFA]'>
                            Available to borrow
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
                        <span className='font-poppins font-bold text-[#A0D911] text-lg cursor-pointer'>Max</span>

                    </div>

                    <div className='flex justify-between px-8 mt-12 font-poppins text-sm leading-4 text-slate-200'>
                        <label>Safer</label>
                        {showFactor()}
                        <label>Riskier</label>
                    </div>

                    <div className='px-8'>
                        <Range
                            step={1}
                            min={0}
                            max={5000}
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
                    </div>
                </div>

                {/* STEP 2 */}
                <div className={step === 2 ? "" : "hidden"}>

                    <div className='mt-4'>
                        <p className='w-full font-montserrat text-center text-lg text-[#A0D911] leading-6'>Please select your interest rate</p>
                        <p className='w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6'>
                            Choose either stable or variable APY for your loan. Please click on the desired rate type and read the info box for more information on each option.
                        </p>
                    </div>

                    <div className="flex flex-row space-x-6 justify-between px-16 my-12 text-lg font-poppins text-[#FAFAFA]">
                        <div onClick={e => { handlerChangeRate(1) }} className={`basis-1/2 bg-[#373368] rounded-xl flex flex-col items-center justify-center h-44 cursor-pointer border-[2px] border-solid border-[#373368] ${rate === 1 ? "bg-gradient-border" : ""}`}>
                            <div className="bg-[#4D4B86] rounded-full w-12 h-12 flex items-center place-content-center">
                                <img src={IcNext} alt={"next"} className="w-7 h-7" />
                            </div>
                            <div className='pt-6 text-base'>Stable APY</div>
                            <div className='pt-1 font-bold text-sm'>6.21 %</div>
                        </div>
                        <div onClick={e => { handlerChangeRate(2) }} className={`basis-1/2 bg-[#373368] rounded-xl flex flex-col items-center justify-center h-44 cursor-pointer border-[2px] border-solid border-[#373368] ${rate === 2 ? "bg-gradient-border" : ""}`}>
                            <div className="bg-[#4D4B86] rounded-full w-12 h-12 flex items-center place-content-center">
                                <img src={IcNext1} alt={"next"} className="w-7 h-7" />
                            </div>
                            <div className='pt-6 text-base'>Variable APY</div>
                            <div className='pt-1 font-bold text-sm'>0.04 %</div>
                        </div>
                    </div>

                </div>

                {/* STEP 3 */}
                <div className={step === 3 ? "" : "hidden"}>

                    <div className='mt-4'>
                        <p className='w-full font-montserrat text-center text-lg text-[#A0D911] leading-6'>Borrow overview</p>
                        <p className='w-4/5 font-poppins text-base text-center text-[#F5F5F5] leading-6 m-auto pt-6'>
                            These are your transaction details. Make sure to check if this is correct before submitting.
                        </p>
                    </div>

                    <div className='border-2 border-solid border-[#363564] mx-8 p-6 mt-10'>

                        <div class="flex justify-between text-lg font-poppins">
                            <div className='text-[#FAFAFA] font-light'>
                                Amount
                            </div>
                            <div className='flex items-center'>
                                <img className='w-6 h-6' src={IcVeb} alt="Token VEBank" />
                                <span className='font-poppins font-bold pl-2'>5,000</span>
                                <span className='text-[#BFBFBF] pl-2'>VET</span>
                            </div>
                        </div>

                        <div class="flex justify-between text-lg font-poppins">
                            <div className='text-[#FAFAFA]'>
                            </div>
                            <div>
                                <span className='font-poppins font-thin text-sm'>5,000</span>
                            </div>
                        </div>

                        <div class="flex justify-between text-lg font-poppins pt-4">
                            <div className='text-[#FAFAFA] font-light'>
                                Interest (APY)
                            </div>
                            <div>
                                <span className='font-poppins font-bold'>0.4</span>
                            </div>
                        </div>

                        <div class="flex justify-between text-lg font-poppins pt-4">
                            <div className='text-[#FAFAFA] font-light'>
                                Interest rate type
                            </div>
                            <div>
                                <span className='font-poppins font-bold'>Variable</span>
                            </div>
                        </div>


                        <div class="flex justify-between text-lg font-poppins pt-4">
                            <div className='text-[#FAFAFA] font-light'>
                                New health factor
                            </div>
                            <div>
                                <span className='font-poppins font-bold text-[#FF4D4F]'>1.03</span>
                            </div>
                        </div>

                    </div>

                    <div className='border-2 border-solid border-[#363564] mx-8 my-12'>

                        <div class="flex justify-between text-lg font-poppins bg-[#39355F]">
                            <div className='text-[#FAFAFA] text-base text-center font-light bg-btn-veb w-1/2 p-1'>
                                1 Borrow
                            </div>
                            <div className='text-[#FAFAFA] text-base text-center font-light w-1/2 p-1'>
                                2 Finished
                            </div>
                        </div>

                        <div class="flex justify-between text-lg font-poppins p-6">
                            <div>
                                <div className='font-light text-base'>
                                    <label className='text-[#50e3ab]'>1/2 Borrow</label>
                                    <div className='text-[#FAFAFA] pt-2'>Please submit to borrow</div>
                                </div>
                            </div>
                            <div className='pt-1'>
                                <BtnBorrow />
                            </div>
                        </div>

                    </div>

                </div>

            </div>

            {
                (step === 1 || step === 2) ?
                    <div className="footer-modal px-8 py-12">
                        <button
                            onClick={e => { handlerStepToStep(e) }}
                            className={`btn-modal-veb w-full ${showCheckStepContinue() ? "bg-btn-veb" : ""} `} >Continue</button>
                    </div> : ""
            }

        </Modal>
    )
}

export default ModalBorrow;