import React from 'react';
import FormSearchFarm from "../components/farm/FormSearchFarm";
import AssetsFarm from "../components/farm/AssetsFarm";

const FarmPage = () => {
    return (

        <section className="box-borrows mx-auto bg-cover bg-center" >

            <div className="lg:px-4 lg:container xl:px-12 mx-auto px-4 min-h-screen pt-16 pb-24">

                <div className="flex flex-row mt-4">

                    {/* <div className='flex-none'>
                    </div> */}

                    <div className='flex  flex-row justify-start items-center space-x-4 w-full text-right cursor-pointer'>

                        <span className="font-poppins text-base font-montserrat">Stake only</span>
                        <div className="flex items-center justify-center">
                            <label htmlFor="toggleB" className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" id="toggleB" className="sr-only" />
                                    <div className="block bg-gray-600 w-10 h-6 rounded-full"/>
                                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"/>
                                </div>
                            </label>
                        </div>

                    </div>

                    <FormSearchFarm />

                </div>

                <AssetsFarm />

            </div>

        </section>

    );
};

export default FarmPage;
