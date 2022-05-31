import React from 'react';
import AssetsStaking from "../components/staking/AssetsStaking";
import ModalStake from '../components/staking/ModalStake';

const StakingPage = () => {
    return (
        <section className="box-borrows mx-auto bg-cover bg-center" >
            <div className="lg:px-4 lg:container xl:px-12 mx-auto px-4 min-h-screen pt-16 pb-24">
                <AssetsStaking />
                <ModalStake />
            </div>
        </section>
    );
};

export default StakingPage;
