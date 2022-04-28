import React from "react";
// import { useDispatch, useSelector } from "react-redux";

import IcBorrow from '../assets/images/ic_borrow.png';
import IcPool from '../assets/images/ic_pool.png';
import IcLend from '../assets/images/ic_lend.png';
import IcStake from '../assets/images/ic_stake.svg';
import IcLaunchpad from '../assets/images/ic_launchpad.jpeg';
import IcTrade from '../assets/images/ic_trade.png';

import bgHome from '../assets/images/home/bg_home.png';
import bgHomeRound from '../assets/images/home/bg_round.png';
import Footer from "../components/partials/Footer";
import Banner from "../components/home/Banner";
import Group from "../components/home/Group";

const HomePage = () => {

  return (
    <div className="box_home w-full min-h-screen">
      {/* <img src={bgHomeRound} className="w-full" /> */}
      <Banner />

      <Group />

      <Footer />
    </div>



  );
};
export default HomePage;
