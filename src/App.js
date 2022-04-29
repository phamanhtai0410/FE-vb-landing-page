
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import { history } from './_helpers';

import MainLayout from './layouts/MainLayout';

import HomePage from './pages/HomePage';
import BorrowPage from './pages/BorrowPage';

import Page404 from './pages/Page404';
import SupplyPage from './pages/SupplyPage';

function App() {

  return (

    <Routes history={history} >

      <Route path="/" element={<MainLayout />} >

        <Route path="/" element={<Navigate to="/home" />} />

        <Route path="/home" element={<HomePage />} />

        <Route path="/borrows" element={<BorrowPage />} />

        <Route path="/supply" element={<SupplyPage />} />

        <Route path="*" element={<Navigate to="/home" />} />

      </Route>

      <Route path="*" element={<Page404 />} />

    </Routes>

  );
}

export default App;
