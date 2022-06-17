import React from "react";
import IcSearch from "../../assets/images/ic_search.png";

const SearchBar = ({ className = "" }) => {
  return (
    <div
      className={`hidden lg:flex flex-1 flex-row space-x-4 bg-[#334158] rounded-lg py-3 px-4 ra justify-between md:hidden ${className}`}
    >
      <input
        className="flex flex-grow bg-transparent focus:outline-none placeholder-grey-3 font-poppins_light appearance-none text-base w-full"
        type="text"
        placeholder={"Search name or paste address"}
      />
      <img alt="search_icon" src={IcSearch} className="w-4.5 h-4.5 object-contain" />
    </div>
  );
};

export default React.memo(SearchBar);
