

import IcCoin from '../../assets/images/ic_logo.svg';
import IcWarning from '../../assets/images/ic-warning-circle.svg';

const AssetsBorrow = () => {

    return (

        <div className="w-full min-h-max rounded-lg bg-[#141432] mt-16 p-10">

            <h4 className="font-montserrat text-[30px] leading-9">Assets to borrow</h4>

            {/* 
                <div className="bg-[#1B1A43] p-3 mt-5">
                    <div class="block">
                        <div class="mt-2">
                        <label class="inline-flex items-center cursor-pointer">
                            <input type="checkbox" class="w-4 h-4 border-0 focus:ring-0" />
                            <span class="ml-2 font-poppins text-base leading-6">Show assets with 0 balance</span>
                        </label>
                        </div>
                    </div>
                </div> 
            */}

            <div className="p-3 mt-5">

                <div className="p-2 flex flex-row justify-start items-center space-x-4 w-full text-right cursor-pointer bg-[#1B1A43]">
                    <img className="w-6 h-6" src={IcWarning} />
                    <span className="text-lg font-poppins text-xs">To borrow you need to supply any asset to be used as collateral.</span>
                </div>

            </div>

            <div className="tbl-veb mt-8">

                <div class="grid grid-cols-5 gap-5 justify-items-center content-around">
                    <div className="px-4 py-2">Assets</div>
                    <div className="px-4 py-2">Available</div>
                    <div className="px-4 py-2">APY, variable</div>
                    <div className="px-4 py-2">APY, stable</div>
                    <div></div>
                </div>

                <div class="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">

                    <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                        <img className="w-6 h-6" src="https://s3-alpha-sig.figma.com/img/1a70/25c5/63c9e4820739ea78686e9bcfb12ea426?Expires=1651449600&Signature=FpitPuHVNJeECaOLYbqTO89cUzktxw17gN3obLpkqaXq4T8X0VHoFyde3lKS5AwgCBuyiklSRZwD52zXrcybL3FkjjAlL-8eVgeTgFmQSnujM8-sSRhVSGK7P4FnO0FztvIz~tHJbHg6E0LcuWUDVhaCuRg8D0H9Qthe1IA~tH2JtkRTMAHEDHwtZZ9JhxXnLmAoBTZVKxLmWy7LNnDkc493BZEOsfHGIjnR8JmN1v4l4OwwMki7yFvaF1RrTkt2XBQGY2wseGER-i0YNm4a-31OdCTvfJj~FYEHnsrrgITZEgQAYI1wFJx3-60bGw62k3pv98kenD1Qvlda~zWlcw__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
                        <span className="text-lg font-semibold w-12 text-left">BUSD</span>
                    </div>

                    <div className="p-2 flex justify-center items-center font-semibold">0</div>
                    <div className="p-2 flex flex-col justify-center items-center content-center">
                        <div className="text-lg font-semibold">4.03 %</div>
                        <div className="border-2 border-solid border-[#363564] p-1">
                            <div className="flex flex-row justify-start items-center space-x-2" >
                                <span className="font-light text-sm">1.80 %</span>
                                <img className="w-4 h-4" src={IcCoin} />
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex justify-center items-center font-semibold">24.03 %</div>
                    <div className="p-2 flex justify-center items-center">
                        <button className="btn-veb h-10">Borrow</button>
                    </div>
                </div>

                <div class="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">

                    <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                        <img className="w-6 h-6" src="https://s3-alpha-sig.figma.com/img/61ea/9ddb/59d8a613c5c74e77b86fe65c5e4283f4?Expires=1651449600&Signature=Q3cCCT0kHQY7qsMZCmU~Mb13iiQ90Y12b2cxR~sirNRyUY2W0IsVSCS5owd6oboEKEEB~55PJwMTOUGv2gBatmwyrwTtA-~bbJ5i3053fcr8L5KSSglwjQUhZ02e0FwBN5~L3gzJLh0J~219sF1JL5VJ5yg8hxiPyhjPXutRBeiVMzPWTaZ7xoW7YQOVIpJm~l6zNGuq1mU4l0W0humOMJuXQZAHNd1aw15JWKD3s3jBp19r58Q4D1f-Gq~kSIGOq40TW~mmBfGnsPDOP-FPLvUs72GzRSNv9QWor7r1J4deY2OCFB5W2q2eot-RE1xOhbItU-z7m817MNHH0~BkGQ__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
                        <span className="text-lg font-semibold w-12 text-left">FEI</span>
                    </div>

                    <div className="p-2 flex justify-center items-center font-semibold">0</div>
                    <div className="p-2 flex flex-col justify-center items-center content-center">
                        <div className="text-lg font-semibold">4.03 %</div>
                        <div className="border-2 border-solid border-[#363564] p-1">
                            <div className="flex flex-row justify-start items-center space-x-2 " >
                                <span className="font-light text-sm">1.80 %</span>
                                <img className="w-4 h-4" src={IcCoin} />
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex justify-center items-center font-semibold">-</div>
                    <div className="p-2 flex justify-center items-center">
                        <button className="btn-veb h-10">Borrow</button>
                    </div>
                </div>

                <div class="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">

                    <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                        <img className="w-6 h-6" src="https://s3-alpha-sig.figma.com/img/6b7f/ca37/00c4e43540a3ed6937b4dba531ba994e?Expires=1651449600&Signature=ZMKNm4wo9RepLhKSCIUro~nUoCccH4Hh0BIzttdTMB03kpgz1vrO~xwqv6mdWekzPP-VjizZQmRN6RPYYA81QyJk7LutX56AcSJrT6hVNZLMoKBq5vL6Q2FCJEPzILAxY~WEt0aVWLReYPVQXyXqvsiXIRA6RFTEGNDcwurC34UZ2KQwhj8xmKpfarx94SxdUmD9PLzNVO4LcPXFywkhnQsgyu4Qb9cxQ5eSWWRNdmejg2OzMEkXu6Qe-dGkw0Lf7XUX~vWlxaPL8GV4HmVEW1c4ds5lAlUGTcKSlvkOdWbXv42r73rKPwLlAC-HOqvDX1XOY59TFMcmAwfyM~LFCg__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
                        <span className="text-lg font-semibold w-12 text-left">Aave</span>
                    </div>

                    <div className="p-2 flex justify-center items-center font-semibold">0</div>
                    <div className="p-2 flex flex-col justify-center items-center content-center">
                        <div className="text-lg font-semibold">4.03 %</div>
                        <div className="border-2 border-solid border-[#363564] p-1">
                            <div className="flex flex-row justify-start items-center space-x-2 font-sans_serif" >
                                <span className="font-light text-sm">1.80 %</span>
                                <img className="w-4 h-4" src={IcCoin} />
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex justify-center items-center font-semibold">12.04 %</div>
                    <div className="p-2 flex justify-center items-center">
                        <button className="btn-veb h-10">Borrow</button>
                    </div>
                </div>

                <div class="grid grid-cols-5 gap-5 mt-6 bg-[#1B1A43] justify-items-center content-around font-poppins text-lg">

                    <div className="p-2 flex flex-row justify-center items-center space-x-4 w-full text-right cursor-pointer">
                        <img className="w-6 h-6" src="https://s3-alpha-sig.figma.com/img/56c8/724e/949d7ca0f95e1529ac216ded7709b26e?Expires=1651449600&Signature=Q8sFQCPy09MWc4M3~JxZmB48HandM8xjcXhiSO5KGPFoS9PNe3tBlWmwtfSD3fGGiZq7AIsug3bRo6ivuXchg-l9hz33Odhtp0iGkW0tekmQOX43~cQ5ggN9aBGe2a6td476X~ghL4q8AHBkagP3J8gdkddCJFuT16225BE5Y51gkCEm76XlgcV-uEFXyfOjgN6GEQbEGXxudsIpoVzWggeOlLG-u0x706nURXUYg86t6YCIQCDnyAvZ4QFqaK8jZiUonLRbBsvt9xqjOD9L0Eo~c6cmIyaq47z1oY91J6mtpVGDbwmPBXzRP2YntVLc9vqTzIpXMFl5O2mUCxRKDA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA" />
                        <span className="text-lg font-semibold">USDP</span>
                    </div>

                    <div className="p-2 flex justify-center items-center font-semibold">0</div>
                    <div className="p-2 flex flex-col justify-center items-center content-center">
                        <div className="text-lg font-semibold">4.03 %</div>
                        <div className="border-2 border-solid border-[#363564] p-1">
                            <div className="flex flex-row justify-start items-center space-x-2 " >
                                <span className="font-light text-sm">1.80 %</span>
                                <img className="w-4 h-4" src={IcCoin} />
                            </div>
                        </div>
                    </div>
                    <div className="p-2 flex justify-center items-center font-semibold">6.13 %</div>
                    <div className="p-2 flex justify-center items-center">
                        <button className="btn-veb h-10">Borrow</button>
                    </div>
                </div>

            </div>

        </div>
    )

}

export default AssetsBorrow;