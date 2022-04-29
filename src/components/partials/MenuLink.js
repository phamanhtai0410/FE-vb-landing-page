import { NavLink } from 'react-router-dom';
const MenuLink = () => {
    return (
        <ul className="box-menus flex flex-col lg:flex-row  items-center justify-center lg:my-auto lg:space-x-4">
            {/* // <ul className="flex flex-col items-center justify-between "> */}

            <li className="p-4 lg:p-0">
                <NavLink to="/trade" className="px-6 text-gray-300 hover:text-gray-100">
                    Trade
                </NavLink>
            </li>

            <li className="p-4 lg:p-0">
                <NavLink to="/lend" className="px-6 text-gray-300 hover:text-gray-100">
                    Lend
                </NavLink>
            </li>

            <li className="p-4 lg:p-0">
                <NavLink to="/pool" className="px-6 text-gray-300 hover:text-gray-100">
                    Pool
                </NavLink>
            </li>


            <li className="p-4 lg:p-0">
                <NavLink to="/stake" className="px-6 text-gray-300 hover:text-gray-100">
                    Stake
                </NavLink>
            </li>

            <li className="p-4 lg:p-0">
                <NavLink to="/farm" className="px-6 text-gray-300 hover:text-gray-100">
                    Farm
                </NavLink>
            </li>

            <li className="p-4 lg:p-0">
                <NavLink to="/lauch-pad" className="px-6 text-gray-300 hover:text-gray-100">
                    Lauchpad
                </NavLink>
            </li>

        </ul >

    )
}

export default MenuLink;