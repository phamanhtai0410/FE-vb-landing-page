import IcNet from '../../assets/images/ic_net.svg';

const NetMarket = () => {

    return (

        <div>

            <div className='flex flex-row justify-start items-center space-x-4 w-full text-right cursor-pointer'>
                <img src={"https://s3-alpha-sig.figma.com/img/0614/91a8/968d66d0099216c04e7a7b6a76f93866?Expires=1651449600&Signature=RjtgHhAjH~sy-vnH3YurK3dYwShbWqhWflV6hG04Ysba~wVCguUE68Jlvbdo-~pPXXKe862ckrtDzqnFwiSrrGg00xSitWFJegbDSXOLb1Zl9vgTBjbiBa17t5bhLh0hFaDwx03hX3l-tWJHIQHbbozoGwXhZybAgg9tj29IZw~sPldATD~zhWE8Nar-gNuQvRNVVIDdDTD3SDMGfo~ELqJcw3qY7IiOZjHlp-EPmMRiMkZU8zLH9gErgzXYD6d06LbAbZcu7G0NskmbcaeM7UhElaNPQGCKN3HBkfEpEUVWWjHtPl0LZB-Km1lG5ZQmo2pwjszwW~iHh0QuI1dtjA__&Key-Pair-Id=APKAINTVSUGEWH5XD5UA"} alt="icon like" />
                <span className="font-poppins text-3xl ">VeBank Market</span>
            </div>

            <div class="flex justify-start">

                <div className="flex justify-start items-center space-x-4 mt-10">
                    <img
                        className="h-12 w-12 object-cover"
                        src={IcNet}
                    />
                    <div className="xs:ml-2 lg:ml-3 font-normal">
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[18px]">Net worth</div>
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[24px] pt-3">$ <span className="text-slate-100">0</span></div>
                    </div>
                </div>

                <div className="flex justify-start items-center space-x-4 mt-10 ml-14">
                    <img
                        className="h-12 w-12 object-cover"
                        src={IcNet}
                    />
                    <div className="xs:ml-2 lg:ml-3 font-normal">
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[18px]">Net APY</div>
                        <div className="font-poppins leading-4 text-[#BFBFBF] text-[24px] pt-3"><span className="text-slate-100">0</span> %</div>
                    </div>
                </div>

            </div>
        </div>
    )

}

export default NetMarket;