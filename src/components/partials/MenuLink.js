import {NavLink, useLocation} from 'react-router-dom';

const MENU_LINKS = [
    {
        name: "Trade",
        path: "/trade"
    },
    {
        name: "Lend",
        path: "/markets"
    },
    {
        name: "Pool",
        path: "/pool"
    },
    {
        name: "Stake",
        path: "/stake"
    },
    {
        name: "Farm",
        path: "/farm"
    },
    {
        name: "Launchpad",
        path: "/launchpad"
    },
];

const MenuLink = () => {
    const location = useLocation();

    return (
        <ul className="box-menus flex flex-col lg:flex-row  items-center justify-center lg:my-auto lg:space-x-4 font-semibold">
            {/* // <ul className="flex flex-col items-center justify-between "> */}

            {
                MENU_LINKS.map((item) => (
                    <li className="p-4 lg:p-0">
                        <NavLink
                            to={item.path}
                            className={`px-6 font-bold text-gray-300 hover:brightness-150 ${item.path === location.pathname ? "text-linear" : ""}`}
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))
            }

        </ul >

    )
}

export default MenuLink;
