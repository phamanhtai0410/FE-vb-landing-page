import { nFormatter } from "../../utils/lib";
import BtnOpenAddLiquidity from "./BtnOpenAddLiquidity";
import BtnOpenRemoveLiquidity from "./BtnOpenRemoveLiquidity";

const PoolRowAction = ({ openRowAssets, item }) => {
  if (openRowAssets.indexOf(item.assetsPoolAddress) === -1) {
    return <></>;
  }

  return (
    <div className="bg-[#182844] p-6 mt-2 fade-in-box">
      <div className="bg-[#26355A] p-6 rounded flex flex-row justify-between rounded space-x-4">
        <div>
          <label className="font-poppins text-[14px] text-[#678BCA]">
            Your Liquidity
          </label>
          <div className="font-montserrat text-[16px] text-[#3EE8FF]">$0</div>
          <div className="font-montserrat text-[16px] text-[#3EE8FF]">
            {item.balanceAccount} LP
          </div>
        </div>

        <div>
          <label className="text-[#678BCA] font-poppins text-[14px]">
            Assets Pooled
          </label>
          <div className="font-montserrat text-[16px] text-[#3EE8FF]">
            {item.amountTokenA} {item.assetsChainA}
          </div>
          <div className="font-montserrat text-[16px] text-[#3EE8FF]">
            {item.amountTokenB} {item.assetsChainB}
          </div>
        </div>

        <div>
          <label className="text-[#678BCA] font-poppins text-[14px]">
          Your Share
          </label>
          <div className="font-montserrat text-[16px] text-[#3EE8FF]">
            {nFormatter((item.balanceAccount * 100) / item.liquidity, 2)}%
          </div>
        </div>

        <div className="flex flex-row space-x-6 justify-center items-center">
          <BtnOpenRemoveLiquidity item={item} />
          <BtnOpenAddLiquidity item={item} />
        </div>
      </div>
    </div>
  );
};

export default PoolRowAction;
