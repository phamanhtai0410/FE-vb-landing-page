import React from 'react'
import ImgComingSoon from '../../assets/images/img_coming_soon.jpg';

const ComingSoon = () => {
    return (
        <img className='w-full h-full' src={ImgComingSoon} alt="" />
    );
};

export default React.memo(ComingSoon);