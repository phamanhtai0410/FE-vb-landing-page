import React from "react";
import IcSearch from "../../assets/images/ic_search.png";

const SearchBar = ({ className = "" }) => {
  return (
    <div
      className={`hidden lg:flex flex-1 flex-row bg-[#334158] rounded-lg py-2 px-4 ra justify-between md:hidden ${className}`}
    >
      <input
        className="bg-transparent focus:outline-none placeholder-slate-300 font-poppins appearance-none text-sm w-full"
        type="text"
        placeholder={"Search name or paste address"}
      />
      <img alt="search_icon" src={IcSearch} className="ml-1 object-contain" />
    </div>
  );
};

export default React.memo(SearchBar);
