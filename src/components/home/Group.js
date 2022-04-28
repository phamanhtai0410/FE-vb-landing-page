import React from "react";
// import { useDispatch, useSelector } from "react-redux";

import IcBorrow from '../../assets/images/home/ic_trade.svg';
import IcLend from '../../assets/images/home/ic_money.svg';
import IcLaunchpad from '../../assets/images/home/ic_launchpad.svg';
import IcPool from '../../assets/images/home/ic_cream.svg';
import IcFarm from '../../assets/images/home/ic_farm.svg';
import IcStake from '../../assets/images/home/ic_piggy.svg';

const Group = () => {

  return (
    <section className="container pt-5 pb-24 mx-auto">

      <div className="lg:px-6 px-4">

        <h3 className="font-bold text-center mb-20 text-2xl lg:text-4xl font-montserrat text-[#19FFFF]">Money market on Vechain</h3>

        <div className="flex flex-wrap 2xl:px-28">

          <div className="pb-8 px-8 w-full lg:w-1/3 h-48 my-12">
            <div className="box-border-gr rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
              <div className="bg-[#734BE4] bg-light-shadow absolute top-[-35px] w-16 h-16 p-3 rounded-full flex justify-center items-center">
                <img src={IcBorrow} alt={"IcBorrow"} className="object-center" />
              </div>
              <div className="mt-2  bottom-4 w-full text-center text-[24px] font-bold font-poppins text-[#19FFFF] mt-10">Borrow</div>
            </div>
          </div>

          <div className="pb-8 px-8 w-full lg:w-1/3 h-48 my-12">
            <div className="box-border-gr rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
              <div className="bg-[#7AC550] bg-light-shadow  absolute top-[-35px] w-16 h-16 p-3 rounded-full flex justify-center items-center">
                <img src={IcLend} alt={"IcBorrow"} className="object-center" />
              </div>
              <div className="mt-2  bottom-4 w-full text-center text-[24px] font-bold font-poppins text-[#19FFFF] mt-10">Lend</div>
            </div>
          </div>

          <div className="pb-8 px-8 w-full lg:w-1/3 h-48 my-12">
            <div className="box-border-gr rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
              <div className="bg-[#96C5FD] bg-light-shadow absolute top-[-35px] w-16 h-16 rounded-full flex justify-center items-center">
                <img src={IcLaunchpad} alt={"IcLaunchpad"} className="object-center" />
              </div>
              <div className="mt-2  bottom-4 w-full text-center text-[24px] font-bold font-poppins text-[#19FFFF] mt-10">Launchpad</div>
            </div>
          </div>
          <div className="pb-8 px-8 w-full lg:w-1/3 h-48 my-12">
            <div className="box-border-gr rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
              <div className="bg-[#23BCE4] bg-light-shadow absolute top-[-35px] w-16 h-16 rounded-full flex justify-center items-center">
                <img src={IcPool} alt={"IcPool"} className="object-center" />
              </div>
              <div className="mt-2  bottom-4 w-full text-center text-[24px] font-bold font-poppins text-[#19FFFF] mt-10">Pool</div>
            </div>
          </div>
          <div className="pb-8 px-8 w-full lg:w-1/3 h-48 my-12">
            <div className="box-border-gr rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
              <div className="bg-[#FFC951] bg-light-shadow absolute top-[-35px] w-16 h-16 rounded-full flex justify-center items-center">
                <img src={IcFarm} alt={"IcFarm"} className="object-center" />
              </div>
              <div className="mt-2  bottom-4 w-full text-center text-[24px] font-bold font-poppins text-[#19FFFF] mt-10">Farm</div>
            </div>
          </div>
          <div className="pb-8 px-8 w-full lg:w-1/3 h-48 my-12">
            <div className="box-border-gr rounded-xl flex flex-row items-object justify-center h-full relative cursor-pointer">
              <div className="bg-[#D643BE] bg-light-shadow absolute top-[-35px] w-16 h-16 rounded-full flex justify-center items-center">
                <img src={IcStake} alt={"IcStake"} className="object-center" />
              </div>
              <div className="mt-2  bottom-4 w-full text-center text-[24px] font-bold font-poppins text-[#19FFFF] mt-10">Stake</div>
            </div>
          </div>


        </div>

      </div>
    </section>



  );
};
export default Group;
