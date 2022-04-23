

import { NavLink } from 'react-router-dom';

import IcLogo from '../../assets/images/ic_logo.svg';
import IcSearch from '../../assets/images/ic_search.png';

const Navbar = () => {

    return (
        <nav className="py-4 flex justify-between">
            <div className="flex flex-row justify-center">
                <NavLink to="/home">
                    <img src={IcLogo} alt="logo VEBank" />
                </NavLink>

                <div className="bg-gradient-search rounded-lg flex flex-row ml-8 py-2 px-4 ra justify-between xl:w-64 2xl:w-96 ">
                    <input
                        className="bg-transparent focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full"
                        type="text"
                        placeholder={"Search"}
                    />
                    <img
                        alt="search_icon"
                        src={IcSearch}
                        className="ml-1 object-contain"
                    />
                </div>
            </div>
            <div className="flex flex-row justify-center space-x-8">
                <div className="box-menus flex flex-row justify-center my-auto space-x-4">

                    <NavLink to="/pool" className="px-6 text-gray-300 hover:text-gray-100">
                        Pool
                    </NavLink>
                    <NavLink to="/stake" className="px-6 text-gray-300 hover:text-gray-100">
                        Stake
                    </NavLink>
                    <NavLink to="/lend" className="px-6 text-gray-300 hover:text-gray-100">
                        Lend
                    </NavLink>
                    <NavLink to="/borrows" className="px-6 text-gray-300 hover:text-gray-100">
                        Borrows
                    </NavLink>
                    <NavLink to="/lauch-pad" className="px-6 text-gray-300 hover:text-gray-100">
                        Lauch pad
                    </NavLink>
                    <NavLink to="/trade" className="px-6 text-gray-300 hover:text-gray-100">
                        Trade
                    </NavLink>
                </div>
                <div className="flex flex-row justify-center items-center my-auto space-x-4">
                    <button className="btn-connect-wallet px-6 py-3">
                        Connect to a wallet
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
