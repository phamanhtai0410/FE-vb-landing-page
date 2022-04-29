import React from "react";

import bgHomeRound from '../../assets/images/home/bg_round.png';

const Banner = ({ handleClickExplore }) => {

    return (
        <div className="flex justify-center items-center relative mt-[-5rem] max-w-max mx-auto max-w-fit min-h-screen">
            <img src={bgHomeRound} className="w-full object-center object-cover blend-dodge fade-in-box" />
            <div className="text-[#19FFFF] absolute w-full h-full flex flex-col justify-center items-center lg:mt-[-12rem] xl:mt-[-14rem] 3xl:mt-[-17rem]">
                <p className="font-nebula text-[30px] leading-10 animatedFadeInUp animated-fadeInDown fadeInDown">VeBank Protocol</p>
                <p className="font-blank_space text-[30px] leading-11 text-center animatedFadeInUp animated-fadeInDown fadeInDown">One-stop DeFi Platform</p>
                <p className="font-nebula text-[30px] leading-10 animatedFadeInUp animated-fadeInDown fadeInDown">on vechain</p>
                <button onClick={handleClickExplore} className="bg-[#19FFFF] text-[#0B2D60] font-nebula leading-6 px-10 py-4 rounded-full mt-4 animated fadeInUp">EXPLORE</button>
            </div>
        </div>
    );
};
export default Banner;
