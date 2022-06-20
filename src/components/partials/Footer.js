
import IcScTwitter from '../../assets/images/social/ic_twitter.svg';
import IcScTelegram from '../../assets/images/social/ic_telegram.svg';
import IcScRobot from '../../assets/images/social/ic_robot.svg';
import IcScGit from '../../assets/images/social/ic_git.svg';
import IcScDiscord from '../../assets/images/social/ic_discord.svg';

const Footer = () => {

  return (

    <footer>

      <div className="lg:container mx-auto ">

        <div className="py-24 px-6 lg:px-10 flex flex-col md:flex-row">

          <div className="flex flex-col font-poppins">
            <h4 className="text-3xl leading-8 text-slate-50">ESOL Labs</h4>
            <div className="text-[#7D86F5] text-base pt-7">Contact Us</div>
            <p className="text-[#8C90BD] text-sm leading-5 pt-6">
              &copy; 2022 ESOL Labs
            </p>
          </div>

          <div className="text-[#7D86F5] sm:ml-0 md:ml-14 md:ml-5s lg:ml-[120px]">

            <div className='flex flex-rows items-left md:mt-9 md:max-w-xs md:justify-between space-x-8 lg:space-x-16 mt-7 md:mt-0'>
              <img src={IcScTelegram} alt="icon Telegram" className="w-8 h-8 cursor-pointer" />
              <img src={IcScDiscord} alt="icon Discord" className="w-8 h-8 cursor-pointer" />
              <img src={IcScTwitter} alt="icon Twitter" className="w-8 h-8 cursor-pointer" />
              <img src={IcScGit} alt="icon Git" className="w-8 h-8 cursor-pointer" />
              <img src={IcScRobot} alt="icon Robot" className="w-8 h-8 cursor-pointer" />
            </div>

            <div className='mt-8'>
              <ul className='font-poppins text-sm leading-6 text-[#7D86F5] flex space-x-6 cursor-pointer'>
                <li>FAQ</li>
                <li>Docs</li>
                <li>Analytics</li>
                <li>Investors</li>
                <li>About Us</li>
                <li>Support</li>
              </ul>
            </div>

          </div>


        </div>

      </div>
    </footer>
  );
};

export default Footer;
