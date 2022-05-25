
import React, { Suspense } from 'react';

import { Routes, Route, Navigate } from 'react-router-dom';

import { history } from './_helpers';

import MainLayout from './layouts/MainLayout';

import Page404 from './pages/Page404';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const PoolPage = React.lazy(() => import('./pages/PoolPage'));
const MarketPage = React.lazy(() => import('./pages/MarketPage'));
const FarmPage = React.lazy(() => import('./pages/FarmPage'));
const TradePage = React.lazy(() => import('./pages/TradePage'));
const StakingPage = React.lazy(() => import('./pages/StakingPage'));
const LaunchPadPage = React.lazy(() => import('./pages/LaunchPadPage'));

function App() {

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes history={history} >

        <Route path="/" element={<MainLayout />} >

          <Route path="/home" element={<Navigate to="/" />} />

          <Route path="/" element={<HomePage />} />

          <Route path="/markets" element={<MarketPage />} />

          <Route path="/pool" element={<PoolPage />} />

          <Route path="/farm" element={<FarmPage/>} />

          <Route path="/trade" element={<TradePage />} />

          <Route path="/stake" element={<StakingPage />} />

          <Route path="/launchpad" element={<LaunchPadPage />} />

          <Route path="*" element={<Navigate to="/" />} />

        </Route>

        <Route path="*" element={<Page404 />} />

      </Routes>

    </Suspense>



  );
}

export default App;
