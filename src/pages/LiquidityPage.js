import React from "react";
import AddLiquidity from "../components/liquidity/AddLiquidity/FrmAddLiquidity";
import ModalSelectToken from "../components/liquidity/AddLiquidity/selectToken/ModalSelectToken";
import Liquidity from "../components/liquidity/HomeLiquidity";

const LiquidityPage = () => {
  return (
    <section className="box-borrows mx-auto bg-cover bg-center">
      <div className="w-full h-[91vh] pb-9 flex items-center justify-center bg-content -z-50">
        <Liquidity />
      </div>
    </section>
  );
};

export default LiquidityPage;
