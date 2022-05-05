
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { history } from './_helpers';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';
import BorrowPage from './pages/BorrowPage';

import Page404 from './pages/Page404';
import SupplyPage from './pages/SupplyPage';
import MarketPage from './pages/MarketPage';

function App() {

  return (

    <Routes history={history} >

      <Route path="/" element={<MainLayout />} >

        <Route path="/home" element={<Navigate to="/" />} />

        <Route path="/" element={<HomePage />} />

        <Route path="/markets" element={<MarketPage />} />

        {/* <Route path="/markets" >
          <Route path="native" element={<MarketPage />} />
          <Route path="usd" element={<MarketPage />} />
          <Route path="*" index element={<MarketPage />} />
        </Route> */}

        <Route path="/borrows" element={<BorrowPage />} />

        <Route path="/supply" element={<SupplyPage />} />

        <Route path="*" element={<Navigate to="/" />} />

      </Route>

      <Route path="*" element={<Page404 />} />

    </Routes>

  );
}

export default App;
