import React, { useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";

import Footer from "../components/partials/Footer";
import Banner from "../components/home/Banner";
import Group from "../components/home/Group";

const HomePage = () => {

  const exploreRef = useRef();

  function handleClickExplore() {
    exploreRef.current.scrollIntoView({ behavior: "smooth" });
  }


  return (
    <div className="box_home w-full min-h-screen">
      <Banner handleClickExplore={handleClickExplore} />
      <Group exploreRef={exploreRef} />
      <Footer />
    </div>

  );
};
export default HomePage;
