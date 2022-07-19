import React from "react";
import AddLiquidity from "../components/liquidity/AddLiquidity/FrmAddLiquidity";
import ModalSelectToken from "../components/liquidity/AddLiquidity/selectToken/ModalSelectToken";

const AddLiquidityPage = () => {
  return (
    <section className="box-borrows mx-auto bg-cover bg-center">
      <div className="w-full h-[91vh] pb-9 flex items-center justify-center bg-content -z-50">
        <AddLiquidity />
      </div>
      <ModalSelectToken />
    </section>
  );
};

export default AddLiquidityPage;
