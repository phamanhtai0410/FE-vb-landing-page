import React from "react";
import AccountAssets from "../components/account/AccountAssets";
// import { useDispatch, useSelector } from "react-redux";

import ModalBorrow from "../components/borrows/ModalBorrow";
import AssetsMarket from "../components/markets/AssetsMarket";
import NetMarket from "../components/markets/NetMarket";
import Overview from "../components/markets/Overview";
import TabMarket from "../components/markets/TabMarket";

const MarketPage = () => {

  return (

    <section className="box-borrows mx-auto bg-cover bg-center" >

      <div className="lg:px-4 lg:container xl:px-12 mx-auto  px-4 min-h-screen pt-16 pb-24">

        <Overview />

        <AccountAssets />

        <div className="flex flex-row mt-12">

          <NetMarket />

          <TabMarket />

        </div>

        <AssetsMarket />

      </div>

      <ModalBorrow />

    </section>

  );
};

export default MarketPage;
