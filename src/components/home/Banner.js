import React from "react";

import bgHomeRound from '../../assets/images/home/bg_round.png';

const Banner = () => {

    return (
        <div className="flex justify-center items-center relative max-w-max mx-auto max-w-fit">
            <img src={bgHomeRound} className="w-full object-center object-cover blend-dodge" />
            <div className="text-[#19FFFF] absolute w-full h-full flex flex-col justify-center items-center xl:mt-[-13rem] 3xl:mt-[-17rem]">
                <p className="font-nebula text-[30px] leading-10">The whole</p>
                <p className="font-blank_space text-[30px] leading-11 text-center">Vechain DeFi Ecosystem</p>
                <p className="font-nebula text-[30px] leading-10">is inside of us</p>
                <p className="font-poppins text-[14px] pt-4">built on Vechain</p>
                <button className="bg-[#19FFFF] text-[#0B2D60] font-nebula leading-6 px-10 py-4 rounded-full mt-4">EXPLORE</button>
            </div>
        </div>
    );
};
export default Banner;
