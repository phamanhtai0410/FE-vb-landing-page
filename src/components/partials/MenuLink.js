import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const MENU_LINKS = [
  {
    name: "Trade",
    path: "/trade",
  },
  {
    name: "Lend",
    path: "/markets",
  },
  {
    name: "Pool",
    path: "/pool",
  },
  {
    name: "Stake",
    path: "/stake",
  },
  {
    name: "Farm",
    path: "/farm",
  },
  {
    name: "Launchpad",
    path: "/launchpad",
  },
];

const MenuLink = ({ menuToggleHandler }) => {
  const location = useLocation();
  const [isMenuHover, setOnMenuHover] = useState(false);

  const onMouseOver = (_) => {
    if (!isMenuHover) setOnMenuHover(true);
  };

  const onMouseOut = (_) => {
    if (isMenuHover) {
      setOnMenuHover(false);
    }
  };

  return (
    <ul
      className="box-menus flex flex-col lg:flex-row items-center justify-center lg:my-auto lg:space-x-4 font-semibold"
      style={{ marginTop: "0px", marginBottom: "0px", height: "100%" }}
    >
      {/* // <ul className="flex flex-col items-center justify-between "> */}

      {MENU_LINKS.map((item, index) => (
        <li
          key={index}
          className="flex items-center h-full p-4 lg:p-0 relative"
          onMouseOver={item.name === "Trade" ? onMouseOver : undefined}
          onMouseLeave={item.name === "Trade" ? onMouseOut : undefined}
        >
          <NavLink
            to={item.path}
            className={`px-6 font-bold text-gray-300 hover:brightness-150 ${
              item.path === location.pathname ? "text-linear" : ""
            }`}
          >
            {item.name}
          </NavLink>
          {item.name === "Trade" && isMenuHover && (
            <div
              className={
                "col justify-center items-start top-[100%] absolute bg-[#00051e] lg:w-[160px] p-4 lg:p-0 rounded-b-lg"
              }
            >
              <NavLink
                to="/trade"
                className={`block px-6 py-2 font-bold text-gray-300 hover:brightness-150 ${
                  isMenuHover ? "text-linear" : ""
                }`}
              >
                Swap
              </NavLink>
              <NavLink
                to="/liquidity/add"
                className={`block px-6 py-2 font-bold text-gray-300 hover:brightness-150 ${
                  isMenuHover ? "text-linear" : ""
                }`}
              >
                Add Liquidity
              </NavLink>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MenuLink;
