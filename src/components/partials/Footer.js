import { footer } from '../../assets';
import { useState } from 'react';
import { Link } from "react-router-dom";

const Footer = () => {
  const products = [
    {title: "Trade", path: "#"},
    {title: "Lend/Borrow", path: "/markets"},
    {title: "Pool", path: "/pool"},
    {title: "Stake", path: "/stake"},
    {title: "Farm", path: "/farm"},
    {title: "Launchpad", path: "/launchpad"}
  ];
  const supports = [
    {title: "Getting Started", link: "https://docs.vebank.io/introduction-to-vebank/sync2-wallet"},
    {title: "FAQ", link: "https://docs.vebank.io/products/faq"}
  ];
  const abouts = [
    {title: "About us", link: "https://docs.vebank.io/"},
    {title: "Docs", link: "https://docs.vebank.io/"}
  ];
  const communities = [
    {
      title: "Telegram",
      icon: footer.IcTelegram,
      details: [
        {
          title: "Official Announcement",
          link: "https://t.me/vebank_offical_ann"
        },
        {
          title: "Community",
          link: "https://t.me/vebankcommunity"
        }
      ]
    },
    {
      title: "Twitter",
      icon: footer.IcTwitter,
      link: "https://twitter.com/vebankprotocol"
    }
  ]

  const [showMore, setShowMore] = useState(false);
  return (

    <footer>

      <div className="w-full bg-[#000324]">

        <div className="py-16 px-6 lg:px-10 flex flex-col md:flex-row justify-between xl:px-52">

          <div className="flex flex-col font-poppins">
            <div className='flex flex-row items-center space-x-2'>
              <img src={footer.IcLogo} alt="Logo VeBank" className="cursor-pointer" />
              <img src={footer.IcLogoText} alt="Logo VeBank" className="cursor-pointer" />
            </div>
            
            <span className="text-[#D9D9D9] text-base pt-8">One-stop DeFi Platform on VeChain</span>
            <p className="text-[#4B5C86] text-sm pt-4">
              &copy; 2022 VeBank
            </p>
          </div>

          <div className="grid grid-cols-4 w-[55%]">
            <div className="flex flex-col">
              <span className="font-poppins_semi_bold text-lg text-[#39C5F1]">PRODUCT</span>
              <div className="flex flex-col space-y-4 mt-6">
                {products.map((item, index) => (
                  <Link
                    to={item.path}
                    className="text-sm text-[#D9D9D9]"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-poppins_semi_bold text-lg text-[#39C5F1]">SUPPORT</span>
              <div className="flex flex-col space-y-4 mt-6">
                {supports.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target={"_blank"}
                    rel="noopener noreferrer"
                    className="text-sm text-[#D9D9D9]"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-poppins_semi_bold text-lg text-[#39C5F1]">ABOUT</span>
              <div className="flex flex-col space-y-4 mt-6">
                {abouts.map((item, index) => (
                  <a
                    key={index}
                    href={item.link}
                    target={"_blank"}
                    rel="noopener noreferrer"
                    className="text-sm text-[#D9D9D9]"
                  >
                    {item.title}
                  </a>
                ))}
              </div>
            </div>
            <div className="flex flex-col">
              <span className="font-poppins_semi_bold text-lg text-[#39C5F1]">COMMUNITY</span>
              <div className="flex flex-col space-y-4 mt-6">
                {communities.map((item, index) => (
                  <div className="relative flex flex-row items-center space-x-3 cursor-pointer" onClick={() => setShowMore(!showMore)}>
                    <img src={item.icon} alt={item.title} />
                    {item?.link ? 
                    <a
                      key={index}
                      href={item.link}
                      target={"_blank"}
                      rel="noopener noreferrer"
                      className="text-sm text-[#D9D9D9]"
                    >
                      {item.title}
                    </a> : <span key={index} className="text-sm text-[#D9D9D9]">{item.title}</span>
                    }
                    
                    {item?.details &&
                    <div>
                      <img src={footer.IcArrowBot} alt={item.title} />
                      {showMore && <div className="absolute flex flex-col divide-y-[1px] divide-[#000324] bg-[#0E1B31] rounded-lg px-4 py-2 top-0 left-36">
                        {item.details.map((item, index) => (
                          <div className="py-2">
                            <a
                              key={index}
                              href={item.link}
                              target={"_blank"}
                              rel="noopener noreferrer"
                              className="text-sm text-[#D9D9D9] whitespace-nowrap"
                            >
                              {item.title}
                            </a>
                          </div>
                        ))}
                      </div>}
                    </div>
                      
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
