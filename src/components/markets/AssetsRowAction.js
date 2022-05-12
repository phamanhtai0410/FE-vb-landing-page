


import BtnOpenBorrow from './BtnOpenBorrow';
import BtnOpenWithdraw from './BtnOpenWithdraw';
import BtnOpenSupply from './BtnOpenSupply';
import BtnOpenRepay from './BtnOpenRepay';

const AssetsRowAction = ({ openRowAssets, item }) => {

    if (openRowAssets.indexOf(item.assetsAddress) === -1) {
        return <></>;
    }

    return (

        <div className='bg-[#182844] p-4 mt-2 flex flex-row justify-between rounded space-x-4 fade-in-box' >

            <div className='bg-[#26355A] p-4 rounded'>
                <h4>Earn</h4>
                <div className='flex flex-row mt-3'>
                    <input
                        className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                        type="text"
                        placeholder={"0"}
                        disabled={true}
                    />
                    <BtnOpenWithdraw item={item} />
                </div>
            </div>

            <div className='bg-[#26355A] p-4 rounded '>
                <h4>Balance</h4>
                <div className='flex flex-row mt-3'>
                    <input
                        className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                        type="text"
                        placeholder={"0"}
                    />
                    <BtnOpenSupply item={item} />
                </div>
            </div>

            <div className='bg-[#26355A] p-4 rounded'>
                <h4>Debt</h4>
                <div className='flex flex-row mt-3'>
                    <input
                        className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                        type="text"
                        placeholder={"0"}
                        disabled={true}
                    />
                    <BtnOpenRepay item={item} />
                </div>
            </div>

            <div className='bg-[#26355A] p-4 rounded'>
                <h4>Balance</h4>
                <div className='flex flex-row mt-3'>
                    <input
                        className="border-[1px] border-[#01E6FE] bg-transparent rounded indent-3 focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full mr-4"
                        type="text"
                        placeholder={"0"}
                    />
                    <BtnOpenBorrow item={item} />
                </div>
            </div>

        </div>

    )


}

export default AssetsRowAction;